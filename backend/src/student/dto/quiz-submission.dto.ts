export interface QuizSubmissionDto {
  talents: { 
    type: string; 
    name: string; 
    measuredScore: number;
    confidence?: 'Low' | 'Medium' | 'High';
  }[];
  interests: { 
    topic: string; 
    strength: number;
    confidence?: 'Low' | 'Medium' | 'High';
    mappedConcepts?: string[]; // ID-relevant concepts mapped from everyday interests
  }[];
  hybridMode?: 'DIRECT_CREATOR' | 'AI_CURATOR' | 'SYSTEM_ARCHITECT' | 'DESIGN_EXECUTOR';
}

