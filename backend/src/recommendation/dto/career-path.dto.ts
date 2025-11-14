export interface CareerPathDto {
  id: string;
  industry: string;
  subfield: string;
  skillTree: string;
  marketingBlurb: string;
  matchScore: number;
  reasoning: string;
  coopAvailable: boolean;
  specializedTraining?: { title: string; description?: string };
  skills: { name: string; description?: string; progress: number }[];
  isHybrid?: boolean;
  hybridType?: string;
  systemBlurb?: string;
  hybridRole?: string;
  requiredSkills?: string[];
  studentMatchedSkills?: string[];
}

