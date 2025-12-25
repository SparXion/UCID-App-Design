import { PrismaClient } from '@prisma/client';
import { QuizSubmissionDto } from './dto/quiz-submission.dto';
import { getMockEmbedding } from '../recommendation/embedding';

const prisma = new PrismaClient();

export class StudentProfileService {
  async submitQuiz(studentId: string, dto: QuizSubmissionDto) {
    // Delete existing interests and talents for this student first
    await prisma.interest.deleteMany({
      where: { studentId }
    });
    
    await prisma.talent.deleteMany({
      where: { studentId }
    });

    // Save interests
    if (dto.interests.length > 0) {
      await prisma.interest.createMany({
        data: dto.interests.map(i => ({
          studentId,
          topic: i.topic,
          strength: i.strength
        }))
      });
    }

    // Save talents
    if (dto.talents.length > 0) {
      await prisma.talent.createMany({
        data: dto.talents.map(t => ({
          studentId,
          type: t.type,
          name: t.name,
          measuredScore: t.measuredScore
        }))
      });
    }

    // Update embedding (store as JSON string for SQLite)
    // Weight by confidence: High=3x, Medium=2x, Low=1x (default to Medium if not provided)
    // Include mapped ID concepts for everyday interests to connect them to design careers
    const talentTexts = dto.talents.flatMap(t => {
      const confidence = t.confidence || 'Medium';
      const weight = confidence === 'High' ? 3 : confidence === 'Medium' ? 2 : 1;
      return Array(weight).fill(t.name);
    });
    
    const interestTexts = dto.interests.flatMap(i => {
      const confidence = i.confidence || 'Medium';
      const weight = confidence === 'High' ? 3 : confidence === 'Medium' ? 2 : 1;
      
      // Include both the original interest and mapped ID concepts
      const texts = [i.topic];
      if (i.mappedConcepts && i.mappedConcepts.length > 0) {
        texts.push(...i.mappedConcepts);
      }
      
      return Array(weight).fill(texts.join(' '));
    });
    
    const text = `Talents: ${talentTexts.join(', ')} | Interests: ${interestTexts.join(', ')}`;
    const embedding = getMockEmbedding(text);

    // Check if student exists, create if not
    const existingStudent = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!existingStudent) {
      // Create student with minimal required fields
      // Note: In production, you should have a proper student creation endpoint
      // For now, we'll create a minimal student record
      await prisma.student.create({
        data: {
          id: studentId,
          name: 'Student', // Default name - should be updated via proper endpoint
          email: `${studentId}@temp.uc.edu`, // Temporary email
          year: 1, // Default year
          embedding: JSON.stringify(embedding),
          hybridMode: dto.hybridMode || null
        }
      });
    } else {
      // Update existing student
      await prisma.student.update({
        where: { id: studentId },
        data: { 
          embedding: JSON.stringify(embedding),
          hybridMode: dto.hybridMode || null
        }
      });
    }
  }
}

