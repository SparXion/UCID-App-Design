import { PrismaClient } from '@prisma/client';

type HybridMode = 'DIRECT_CREATOR' | 'AI_CURATOR' | 'SYSTEM_ARCHITECT' | 'DESIGN_EXECUTOR';
import { CareerPathDto } from './dto/career-path.dto';
import { getMockEmbedding, cosineSimilarity } from './embedding';
import { 
  getForwardMappedSkills, 
  getBackwardMappedSkills, 
  calculateSkillOverlap,
  HYBRID_SKILL_WEIGHTS
} from '../mapping/bidirectional-mapping';

const prisma = new PrismaClient();

export class RecommendationService {
  async getCareerPaths(studentId: string): Promise<CareerPathDto[]> {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { interests: true, talents: true, skillProgress: true }
    });

    if (!student) {
      throw new Error('Student not found');
    }

    const skillTrees = await prisma.skillTree.findMany({
      include: {
        subfield: { include: { industry: true } },
        skills: true,
        specializedTraining: true,
        coopOpportunities: { where: { active: true } }
      }
    });

    // Parse embedding from JSON string
    const studentEmbedding = JSON.parse(student.embedding || '[]') as number[];

    // Infer hybridMode if not set
    let hybridMode = student.hybridMode;
    if (!hybridMode) {
      const talentNames = student.talents.map(t => t.name.toLowerCase());
      const interestTopics = student.interests.map(i => i.topic.toLowerCase());
      const mappedConcepts = student.interests.flatMap(i => {
        // Extract mapped concepts from interests (would need to be stored or recalculated)
        // For now, use interest topics as proxy
        return [];
      });

      const hasSignal = (list: string[], keywords: string[]) =>
        list.some(item => keywords.some(k => item.includes(k.toLowerCase())));

      const signals = {
        DIRECT_CREATOR: hasSignal(talentNames, ['drawing', 'sculpting', 'sketching', 'crafting']) ? 1 : 0,
        AI_CURATOR: hasSignal(interestTopics, ['ai', 'machine learning']) || hasSignal(mappedConcepts, ['ai']) ? 1 : 0,
        SYSTEM_ARCHITECT: (hasSignal(talentNames, ['coding', 'programming', 'scripting', 'automation', 'systems']) || 
                          hasSignal(interestTopics, ['gaming', 'sci-fi', 'technology', 'systems', 'logic'])) ? 1 : 0,
        DESIGN_EXECUTOR: hasSignal(talentNames, ['3d printing', 'manufacturing', 'prototyping', 'execution']) ? 1 : 0
      };

      const inferred = Object.entries(signals)
        .filter(([_, value]) => value > 0)
        .sort((a, b) => b[1] - a[1])[0]?.[0] as HybridMode | undefined;

      if (inferred) {
        hybridMode = inferred;
        await prisma.student.update({ 
          where: { id: studentId }, 
          data: { hybridMode: hybridMode as string } 
        });
      }
    }

    // FORWARD MAPPING: Extract student skills from interests and talents
    const studentInterests = student.interests.map(i => i.topic);
    const studentTalents = student.talents.map(t => t.name);
    const allStudentItems = [...studentInterests, ...studentTalents];
    const studentSkillsSet = new Set(getForwardMappedSkills(allStudentItems));
    // Also add direct talent names as skills
    studentTalents.forEach(talent => studentSkillsSet.add(talent));
    const studentSkills = Array.from(studentSkillsSet);

    return skillTrees.map(tree => {
      const treeText = `${tree.name} ${tree.subfield.name} ${tree.subfield.industry.name}`;
      let score = cosineSimilarity(studentEmbedding, getMockEmbedding(treeText)) * 100;
      let reasoning = '';

      const treeSkills = tree.skills.map(s => s.name);
      const subfield = tree.subfield.name;
      const industry = tree.subfield.industry.name;

      // BACKWARD MAPPING: Industry/Subfield required skills
      const requiredSkills = getBackwardMappedSkills(industry, subfield);

      // INTERSECTION: Student skills ∩ Industry needs ∩ SkillTree skills
      const { overlap, overlapRatio } = calculateSkillOverlap(studentSkills, requiredSkills);
      
      // Also check overlap with actual SkillTree skills
      const treeSkillOverlap = treeSkills.filter(skill => 
        studentSkillsSet.has(skill) || requiredSkills.includes(skill)
      );

      // Score boost from skill overlap
      const overlapCount = Math.max(overlap.length, treeSkillOverlap.length);
      score += overlapCount * 10; // +10 per matching skill
      
      if (overlapCount >= 3) {
        score += 20; // Bonus for strong alignment
        reasoning += ` | ${overlapCount} industry-required skills matched`;
      } else if (overlapCount > 0) {
        reasoning += ` | ${overlapCount} skill${overlapCount > 1 ? 's' : ''} aligned`;
      }

      // HYBRID BOOST
      if (tree.isHybrid && hybridMode === 'SYSTEM_ARCHITECT') {
        const hybridSkills = treeSkills.filter(s => HYBRID_SKILL_WEIGHTS[s]);
        let hybridBoost = 0;
        hybridSkills.forEach(skill => {
          hybridBoost += HYBRID_SKILL_WEIGHTS[skill] || 0;
        });
        score += hybridBoost;
        if (hybridBoost > 0) {
          reasoning += ` | Hybrid system design affinity (+${hybridBoost})`;
        }
      } else if (hybridMode) {
        // Other hybrid mode boosts
        if (tree.isHybrid && hybridMode === 'AI_CURATOR') {
          score += 25;
          reasoning += ` | AI curation alignment`;
        } else if (tree.isHybrid && hybridMode === 'DESIGN_EXECUTOR') {
          score += 20;
          reasoning += ` | Design execution alignment`;
        } else if (!tree.isHybrid && hybridMode === 'DIRECT_CREATOR') {
          score += 30;
          reasoning += ` | Direct creation alignment`;
        }
      }

      return {
        id: tree.id,
        industry: tree.subfield.industry.name,
        subfield: tree.subfield.name,
        skillTree: tree.name,
        marketingBlurb: tree.marketingBlurb,
        matchScore: Math.round(Math.min(score, 100)),
        reasoning: reasoning.trim() || `${score > 80 ? 'High' : 'Medium'} fit: strong talent/interest overlap`,
        requiredSkills: requiredSkills.length > 0 ? requiredSkills.slice(0, 5) : undefined,
        studentMatchedSkills: overlap.length > 0 ? overlap.slice(0, 5) : undefined,
        coopAvailable: tree.coopOpportunities.length > 0,
        specializedTraining: tree.specializedTraining ? {
          title: tree.specializedTraining.title,
          description: tree.specializedTraining.description || undefined
        } : undefined,
        skills: tree.skills.map(s => ({
          name: s.name,
          description: s.description || undefined,
          progress: student.skillProgress.find(p => p.skillId === s.id)?.proficiency || 0
        })),
        isHybrid: tree.isHybrid,
        hybridType: tree.hybridType || undefined,
        systemBlurb: tree.systemBlurb || undefined,
        hybridRole: hybridMode || undefined
      };
    }).sort((a, b) => b.matchScore - a.matchScore).slice(0, 6);
  }
}

