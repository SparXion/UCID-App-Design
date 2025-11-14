/**
 * Industry/Subfield → Required Skills Mapping
 * 
 * This is the "backward" mapping: Industry needs → Skills required
 * Combined with the "forward" mapping (Interests/Talents → Skills),
 * we can find intersections where student interests/talents align with industry needs.
 */

// Industry → Required Skills Mapping
export const INDUSTRY_SKILL_REQUIREMENTS: Record<string, string[]> = {
  'Consumer Products': [
    'Sketching', '3D Modeling', 'Material Understanding', 'Manufacturing Processes',
    'User Research', 'Market Analysis', 'Aesthetic Design', 'Ergonomics',
    'Prototyping', 'Color Theory', 'Form Understanding', 'Packaging Design',
    'Brand Understanding', 'Trend Analysis', 'CAD', 'Rendering'
  ],
  'Automotive': [
    '3D Modeling', 'CAD', 'Aerodynamics', 'Ergonomics', 'Material Science',
    'Manufacturing Processes', 'Technical Drawing', 'Vehicle Design',
    'Performance Design', 'Safety Design', 'Form Understanding', 'Spatial Awareness',
    'Engineering Principles', 'Prototyping', 'Rendering', 'Visualization'
  ],
  'Toy & Game Design': [
    'Character Design', 'Play Design', 'Safety Design', 'Child Psychology',
    'Interactive Design', 'Game Design', 'Color Theory', 'Form Understanding',
    'Prototyping', 'User Testing', 'Narrative Design', 'Visual Communication',
    'Material Understanding', 'Durability Design', 'Educational Design'
  ],
  'Medical Devices': [
    'Ergonomics', 'Safety Design', 'Human Factors', 'Medical Knowledge',
    'Precision Design', 'Material Science', 'Regulatory Understanding',
    'User Research', 'Accessibility', 'Hygiene Design', 'Technical Documentation',
    'Prototyping', 'Testing', 'Biomechanics', 'Assistive Technology'
  ],
  'Electronics': [
    'Technical Design', 'Electronics', 'User Interface', 'Ergonomics',
    'Material Science', 'Manufacturing Processes', 'Form Factor Design',
    'Technical Documentation', 'Prototyping', 'CAD', '3D Modeling',
    'User Experience', 'Interface Design', 'Component Integration'
  ],
  'Furniture': [
    'Furniture Design', 'Ergonomics', 'Material Understanding', 'Joinery',
    'Spatial Design', 'Form Understanding', 'Craft Techniques', 'Prototyping',
    '3D Modeling', 'CAD', 'Sustainability', 'Manufacturing Processes',
    'Aesthetic Design', 'Functionality', 'Assembly Design'
  ],
  'Footwear': [
    'Footwear Design', 'Biomechanics', 'Material Understanding', 'Pattern Making',
    'Ergonomics', 'Performance Design', 'Durability Design', 'Aesthetic Design',
    'Prototyping', '3D Modeling', 'Color Theory', 'Form Understanding',
    'Manufacturing Processes', 'Fit & Comfort', 'Trend Analysis'
  ],
  'Packaging': [
    'Packaging Design', 'Material Understanding', 'Sustainability',
    'Brand Communication', 'Graphic Design', 'Structural Design',
    'Manufacturing Processes', 'Prototyping', 'User Experience',
    'Visual Communication', 'Form Understanding', 'Efficiency Design'
  ],
  'Lighting': [
    'Lighting Design', 'Electrical Understanding', 'Material Science',
    'Form Design', 'Aesthetic Design', 'Ergonomics', 'Prototyping',
    '3D Modeling', 'CAD', 'Optics', 'Energy Efficiency', 'Spatial Design',
    'Visual Communication', 'Technical Documentation'
  ],
  'Tools': [
    'Ergonomics', 'Material Science', 'Manufacturing Processes', 'Durability Design',
    'Functionality', 'Safety Design', 'Technical Design', 'Prototyping',
    'CAD', '3D Modeling', 'User Research', 'Craft Techniques',
    'Precision Design', 'Performance Design'
  ],
  'Sports Equipment': [
    'Athletic Equipment Design', 'Biomechanics', 'Performance Design',
    'Ergonomics', 'Durability Design', 'Material Science', 'Prototyping',
    'Safety Design', 'Aerodynamics', 'Form Understanding', 'Testing',
    'User Research', 'Technical Documentation', 'Manufacturing Processes'
  ],
  'Outdoor Products': [
    'Outdoor Equipment Design', 'Durability Design', 'Weather Resistance',
    'Portable Design', 'Ergonomics', 'Material Science', 'Sustainability',
    'Prototyping', 'Safety Design', 'Lightweight Design', 'Functionality',
    'User Research', 'Adventure Products', 'Environmental Design'
  ]
};

// Subfield → Required Skills Mapping (more specific than industry)
export const SUBFIELD_SKILL_REQUIREMENTS: Record<string, string[]> = {
  'Footwear Design': [
    'Footwear Design', 'Biomechanics', 'Pattern Making', 'Last Design',
    'Material Understanding', 'Ergonomics', 'Performance Design',
    'Durability Design', 'Aesthetic Design', 'Fit & Comfort',
    'Prototyping', '3D Modeling', 'Color Theory', 'Trend Analysis'
  ],
  'Furniture Design': [
    'Furniture Design', 'Ergonomics', 'Joinery', 'Material Understanding',
    'Spatial Design', 'Form Understanding', 'Craft Techniques',
    'Sustainability', 'Manufacturing Processes', 'Aesthetic Design',
    'Prototyping', '3D Modeling', 'CAD', 'Assembly Design'
  ],
  'Transportation Design': [
    'Vehicle Design', 'Aerodynamics', 'Ergonomics', '3D Modeling',
    'CAD', 'Material Science', 'Performance Design', 'Safety Design',
    'Form Understanding', 'Spatial Awareness', 'Engineering Principles',
    'Prototyping', 'Rendering', 'Visualization', 'Technical Documentation'
  ],
  'Toy Design': [
    'Character Design', 'Play Design', 'Safety Design', 'Child Psychology',
    'Interactive Design', 'Color Theory', 'Form Understanding',
    'Prototyping', 'User Testing', 'Narrative Design', 'Durability Design',
    'Material Understanding', 'Educational Design', 'Visual Communication'
  ],
  'Medical Device Design': [
    'Medical Device Design', 'Ergonomics', 'Safety Design', 'Human Factors',
    'Precision Design', 'Material Science', 'Regulatory Understanding',
    'Medical Knowledge', 'Accessibility', 'Hygiene Design', 'Prototyping',
    'Testing', 'Biomechanics', 'Assistive Technology', 'Technical Documentation'
  ],
  'Packaging Design': [
    'Packaging Design', 'Structural Design', 'Material Understanding',
    'Sustainability', 'Brand Communication', 'Graphic Design',
    'Manufacturing Processes', 'Prototyping', 'User Experience',
    'Visual Communication', 'Efficiency Design', 'Form Understanding'
  ],
  'Lighting Design': [
    'Lighting Design', 'Electrical Understanding', 'Material Science',
    'Form Design', 'Aesthetic Design', 'Optics', 'Energy Efficiency',
    'Spatial Design', 'Ergonomics', 'Prototyping', '3D Modeling',
    'CAD', 'Visual Communication', 'Technical Documentation'
  ],
  'Tool Design': [
    'Tool Design', 'Ergonomics', 'Material Science', 'Durability Design',
    'Functionality', 'Safety Design', 'Technical Design', 'Precision Design',
    'Manufacturing Processes', 'Prototyping', 'CAD', 'User Research',
    'Craft Techniques', 'Performance Design', 'Technical Documentation'
  ],
  'Sports Equipment Design': [
    'Athletic Equipment Design', 'Biomechanics', 'Performance Design',
    'Ergonomics', 'Durability Design', 'Material Science', 'Aerodynamics',
    'Safety Design', 'Prototyping', 'Testing', 'Form Understanding',
    'User Research', 'Technical Documentation', 'Manufacturing Processes'
  ],
  'Outdoor Equipment Design': [
    'Outdoor Equipment Design', 'Durability Design', 'Weather Resistance',
    'Portable Design', 'Lightweight Design', 'Ergonomics', 'Material Science',
    'Sustainability', 'Safety Design', 'Functionality', 'Prototyping',
    'Adventure Products', 'Environmental Design', 'User Research'
  ]
};

/**
 * Get required skills for an industry
 */
export function getIndustrySkills(industryName: string): string[] {
  return INDUSTRY_SKILL_REQUIREMENTS[industryName] || [];
}

/**
 * Get required skills for a subfield
 */
export function getSubfieldSkills(subfieldName: string): string[] {
  return SUBFIELD_SKILL_REQUIREMENTS[subfieldName] || [];
}

/**
 * Calculate skill overlap between student talents/interests and industry/subfield requirements
 */
export function calculateSkillOverlap(
  studentSkills: string[],
  requiredSkills: string[]
): number {
  const normalizedStudent = studentSkills.map(s => s.toLowerCase());
  const normalizedRequired = requiredSkills.map(s => s.toLowerCase());
  
  const matches = normalizedRequired.filter(req => 
    normalizedStudent.some(student => 
      student.includes(req) || req.includes(student)
    )
  );
  
  return requiredSkills.length > 0 ? matches.length / requiredSkills.length : 0;
}

