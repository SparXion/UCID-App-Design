import { PrismaClient } from '@prisma/client';
import { getMockEmbedding } from '../src/recommendation/embedding';

const prisma = new PrismaClient();

async function main() {
  // Clear existing data (for development)
  await prisma.coopOpportunity.deleteMany();
  await prisma.course.deleteMany();
  await prisma.skillProgress.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.specializedTraining.deleteMany();
  await prisma.skillTree.deleteMany();
  await prisma.subfield.deleteMany();
  await prisma.industry.deleteMany();
  await prisma.talent.deleteMany();
  await prisma.interest.deleteMany();
  await prisma.profile.deleteMany();
  await prisma.student.deleteMany();

  // Industries
  const consumer = await prisma.industry.create({ data: { name: "Consumer Products" } });
  const automotive = await prisma.industry.create({ data: { name: "Automotive" } });
  const toy = await prisma.industry.create({ data: { name: "Toy & Game Design" } });

  // Subfields
  const footwear = await prisma.subfield.create({ data: { name: "Footwear Design", industryId: consumer.id } });
  const furniture = await prisma.subfield.create({ data: { name: "Furniture Design", industryId: consumer.id } });
  const automotiveDesign = await prisma.subfield.create({ data: { name: "Transportation Design", industryId: automotive.id } });
  const toyDesign = await prisma.subfield.create({ data: { name: "Toy Design", industryId: toy.id } });

  // TRADITIONAL: Direct product design
  const traditionalFootwearTree = await prisma.skillTree.create({
    data: {
      name: "Footwear Concept Designer",
      marketingBlurb: "Design the next iconic sneaker. From sketch to shelf — worn by millions.",
      systemBlurb: null,
      subfieldId: footwear.id,
      isHybrid: false,
      hybridType: null,
      skills: {
        create: [
          { name: "Hand Sketching", description: "Traditional drawing and ideation" },
          { name: "3D Sculpting", description: "Digital sculpting for footwear design" },
          { name: "Material Selection", description: "Choosing materials for performance and aesthetics" }
        ]
      }
    }
  });

  // HYBRID: System that designs the product
  const generativeFootwearTree = await prisma.skillTree.create({
    data: {
      name: "Generative Footwear System Architect",
      marketingBlurb: "Design the AI system that creates Nike's next 100 sneakers.",
      systemBlurb: "You don't draw the shoe. You code the rules that generate it.",
      subfieldId: footwear.id,
      isHybrid: true,
      hybridType: "GENERATIVE",
      skills: {
        create: [
          { name: "AI Variant Generation", description: "Creating systems that generate design variations" },
          { name: "Parametric Sizing Logic", description: "Coding rules for size scaling and proportions" },
          { name: "Style DNA Encoding", description: "Translating brand aesthetics into algorithmic rules" }
        ]
      }
    }
  });

  // TRADITIONAL: Direct product design
  const traditionalFurnitureTree = await prisma.skillTree.create({
    data: {
      name: "Ergonomic Furniture Designer",
      marketingBlurb: "Shape how people sit, work, and live. Timeless design meets human comfort.",
      systemBlurb: null,
      subfieldId: furniture.id,
      isHybrid: false,
      hybridType: null,
      skills: {
        create: [
          { name: "Ergonomics", description: "Human-centered design principles" },
          { name: "Material Science", description: "Understanding materials for furniture" },
          { name: "Prototyping", description: "Building physical models" }
        ]
      }
    }
  });

  // HYBRID: System that designs the product
  const configurableFurnitureTree = await prisma.skillTree.create({
    data: {
      name: "Configurable Furniture System Architect",
      marketingBlurb: "Design the system that generates custom furniture for every space.",
      systemBlurb: "You don't design the chair. You design the system that designs infinite chairs.",
      subfieldId: furniture.id,
      isHybrid: true,
      hybridType: "CONFIGURABLE_SYSTEMS",
      skills: {
        create: [
          { name: "Modular System Design", description: "Creating configurable component systems" },
          { name: "Constraint-Based Generation", description: "Coding rules for space-optimized furniture" },
          { name: "User Preference Algorithms", description: "Systems that learn and adapt to user needs" }
        ]
      }
    }
  });

  // HYBRID: Toy Design System
  const generativeToyTree = await prisma.skillTree.create({
    data: {
      name: "Generative Toy System Architect",
      marketingBlurb: "Code the system that designs toys kids love.",
      systemBlurb: "You don't design the toy. You design the AI that designs toys.",
      subfieldId: toyDesign.id,
      isHybrid: true,
      hybridType: "GENERATIVE",
      skills: {
        create: [
          { name: "Play Pattern Analysis", description: "Understanding what makes toys engaging" },
          { name: "Generative Form Systems", description: "AI systems that create toy variations" },
          { name: "Safety Constraint Encoding", description: "Coding safety rules into generation systems" }
        ]
      }
    }
  });

  // TRADITIONAL: Toy Design
  const traditionalToyTree = await prisma.skillTree.create({
    data: {
      name: "Toy Concept Designer",
      marketingBlurb: "Design toys that spark imagination and joy.",
      systemBlurb: null,
      subfieldId: toyDesign.id,
      isHybrid: false,
      hybridType: null,
      skills: {
        create: [
          { name: "Character Design", description: "Creating memorable toy characters" },
          { name: "Play Mechanics", description: "Designing how toys interact and function" },
          { name: "Child Safety", description: "Ensuring toys meet safety standards" }
        ]
      }
    }
  });

  // Get skills for courses
  const sculpting = await prisma.skill.findFirst({ where: { skillTreeId: traditionalFootwearTree.id, name: "3D Sculpting" } });
  const sketching = await prisma.skill.findFirst({ where: { skillTreeId: traditionalFootwearTree.id, name: "Hand Sketching" } });
  const aiVariant = await prisma.skill.findFirst({ where: { skillTreeId: generativeFootwearTree.id, name: "AI Variant Generation" } });

  if (sculpting && sketching) {
    await prisma.course.createMany({
      data: [
        { title: "ZBrush for Footwear", provider: "Gnomon", durationHours: 40, skillId: sculpting.id },
        { title: "Hand Sketching Fundamentals", provider: "Gnomon", durationHours: 20, skillId: sketching.id },
      ]
    });
  }

  if (aiVariant) {
    await prisma.course.createMany({
      data: [
        { title: "Generative AI for Product Design", provider: "Coursera", durationHours: 30, skillId: aiVariant.id },
      ]
    });
  }

  // Co-ops - Traditional and Hybrid
  await prisma.coopOpportunity.createMany({
    data: [
      { company: "Nike", title: "Footwear Design Intern", openings: 3, skillTreeId: traditionalFootwearTree.id },
      { company: "Nike", title: "Generative Design Systems Intern", openings: 2, skillTreeId: generativeFootwearTree.id },
      { company: "Herman Miller", title: "Furniture Design Co-op", openings: 2, skillTreeId: traditionalFurnitureTree.id },
      { company: "Herman Miller", title: "Configurable Systems Architect", openings: 1, skillTreeId: configurableFurnitureTree.id },
      { company: "Fisher-Price", title: "Toy Designer", openings: 4, skillTreeId: traditionalToyTree.id },
      { company: "Fisher-Price", title: "Generative Toy Systems Engineer", openings: 2, skillTreeId: generativeToyTree.id },
    ]
  });

  // Create a test student
  const testStudent = await prisma.student.create({
    data: {
      name: "Test Student",
      email: "test@uc.edu",
      year: 2,
      embedding: JSON.stringify(getMockEmbedding("Talents: Drawing, Spatial Awareness | Interests: Footwear, Design"))
    }
  });

  console.log("\nSeed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`Test Student Created:`);
  console.log(`   ID: ${testStudent.id}`);
  console.log(`   Name: ${testStudent.name}`);
  console.log(`   Email: ${testStudent.email}`);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log(`\nUpdate frontend/src/App.tsx with studentId: "${testStudent.id}"`);
  console.log("");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

