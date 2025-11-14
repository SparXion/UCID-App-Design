/**
 * Unified Bidirectional Mapping System
 * 
 * FORWARD: Interests/Talents → Skills
 * BACKWARD: Industry/Subfield → Required Skills
 * HYBRID: Skill weights for hybrid paths
 */

// FORWARD: Interests/Talents → Skills
export const FORWARD_MAPPING: Record<string, string[]> = {
  // Everyday → Skills
  'Movies': ['Storytelling', 'Narrative Design', 'Visual Communication', 'Character Design', 'Cinematography'],
  'Books': ['Storytelling', 'Research', 'Concept Development', 'User Narratives', 'Content Strategy'],
  'Sci-Fi': ['Speculative Design', 'Futuristic Products', 'World-Building', 'Systems Thinking', 'AI Integration', 'Innovation', 'Technology Integration'],
  'Fantasy': ['Imaginative Design', 'World Building', 'Themed Products', 'Narrative Products', 'Character Design'],
  'Comics': ['Visual Storytelling', 'Character Design', 'Sequential Art', 'Graphic Communication', 'Pop Culture'],
  'Photography': ['Visual Composition', 'Lighting Design', 'Aesthetic Sense', 'Documentation', 'Visual Communication'],
  'Theater': ['Set Design', 'Props Design', 'Spatial Design', 'Narrative Environments', 'Experience Design'],
  
  // Technology & Innovation
  'Gaming': ['Game Design', 'User Experience', 'Interactive Systems', 'Interface Design', 'Prototyping', 'Interactive Products', 'Entertainment Products'],
  'Coding': ['Parametric Design', 'Automation Scripts', 'Generative Systems', 'Prompt Engineering', 'System Design', 'User Interface', 'Digital Products', 'Software Design'],
  'Robotics': ['Mechanical Design', 'Automation', 'Human-Robot Interaction', 'Technical Systems', 'Innovation'],
  'Drones': ['Aerospace Design', 'Remote Control', 'Technical Systems', 'Portable Technology', 'Innovation'],
  '3D Printing': ['Additive Manufacturing', 'Digital Fabrication', 'File-to-Factory', 'Material Optimization', 'Rapid Prototyping', 'Manufacturing', 'Material Science'],
  
  // Arts & Creativity
  'Art': ['Aesthetic Design', 'Visual Communication', 'Creative Expression', 'Form & Function', 'Visual Language'],
  'Drawing': ['Sketching', 'Rendering', 'Concept Art', 'Illustration', 'Visual Communication', 'Concept Development'],
  'Painting': ['Color Theory', 'Aesthetic Sense', 'Visual Composition', 'Creative Expression', 'Surface Design'],
  'Sculpting': ['3D Modeling', 'Form Development', 'Clay Modeling', 'Digital Sculpting', '3D Form', 'Material Understanding', 'Spatial Design'],
  'Fashion': ['Textile Design', 'Pattern Making', 'Aesthetic Design', 'Wearable Products', 'Trend Analysis'],
  'Jewelry': ['Small-Scale Design', 'Material Science', 'Aesthetic Detail', 'Craft Techniques', 'Personal Products'],
  
  // Music & Sound
  'Music': ['Audio Products', 'Instrument Design', 'Sound Experience', 'Performance Tools', 'Acoustic Design'],
  'Instruments': ['Musical Product Design', 'Ergonomics', 'Acoustic Engineering', 'Craft Techniques', 'Performance Design'],
  
  // Sports & Fitness
  'Sports': ['Ergonomics', 'Biomechanics', 'Performance Products', 'Durability Testing', 'Athletic Equipment', 'Performance Design', 'Durability Design'],
  'Fitness': ['Exercise Equipment', 'Ergonomics', 'Performance Design', 'Health Products', 'Human Factors'],
  'Running': ['Footwear Design', 'Performance Products', 'Biomechanics', 'Durability', 'Athletic Equipment'],
  'Cycling': ['Bicycle Design', 'Transportation', 'Performance Products', 'Safety Design', 'Ergonomics'],
  
  // Food & Cooking
  'Cooking': ['Kitchen Products', 'Food Experience', 'Culinary Tools', 'Dining Design', 'Food Service Design'],
  'Baking': ['Kitchen Tools', 'Precision Design', 'Craft Techniques', 'Food Experience', 'Detail Design'],
  
  // Nature & Environment
  'Nature': ['Sustainable Design', 'Eco-Friendly Products', 'Biomimicry', 'Outdoor Products', 'Environmental Design'],
  'Animals': ['Pet Products', 'Wildlife Conservation', 'Animal Welfare Products', 'Biomimicry', 'Animal Behavior'],
  'Hiking': ['Outdoor Equipment', 'Portable Products', 'Durability Design', 'Ergonomics', 'Adventure Products'],
  
  // Travel & Exploration
  'Travel': ['Portable Products', 'Cultural Design', 'Transportation', 'Luggage Design', 'Travel Accessories'],
  'Architecture': ['Spatial Design', 'Built Environment', 'Furniture Design', 'Lighting Design', 'Environmental Design'],
  
  // Helping & Service
  'Helping Others': ['Assistive Technology', 'Medical Devices', 'Inclusive Design', 'Accessibility', 'Social Impact'],
  'Healthcare': ['Medical Devices', 'Healthcare Products', 'Ergonomics', 'Safety Design', 'Human-Centered Design'],
  'Education': ['Educational Products', 'Learning Tools', 'Child Products', 'Safety Design', 'Pedagogical Design'],
  
  // Family & Relationships
  'Family': ['Family-Centered Products', 'Safety Design', 'Multi-generational Design', 'Child Products', 'Home Products'],
  'Children': ['Child Products', 'Safety Design', 'Educational Toys', 'Play Design', 'Developmental Products'],
  
  // Magic & Mystery
  'Magic': ['Illusion', 'User Experience', 'Hidden Mechanisms', 'Surprise & Delight', 'Interactive Design'],
  'Puzzles': ['Problem-Solving Products', 'Interactive Design', 'Cognitive Design', 'Game Design', 'Challenge Design'],
  
  // Science & Research
  'Science': ['Research Tools', 'Laboratory Equipment', 'Scientific Instruments', 'Precision Design', 'Technical Products'],
  'Biology': ['Scientific Instruments', 'Research Tools', 'Biomimicry', 'Medical Devices', 'Laboratory Equipment'],
  
  // Craft & Making
  'Woodworking': ['Furniture Design', 'Craft Techniques', 'Material Understanding', 'Joinery', 'Hand Skills'],
  'Metalworking': ['Metal Products', 'Fabrication', 'Material Science', 'Craft Techniques', 'Technical Design'],
  'Textiles': ['Fabric Design', 'Soft Products', 'Material Understanding', 'Pattern Making', 'Textile Products'],
  
  // Talents → Skills (Direct mapping)
  'Drawing': ['Sketching', 'Rendering', 'Concept Art', 'Illustration', 'Visual Communication'],
  'Sculpting': ['3D Modeling', 'Form Development', 'Clay Modeling', 'Digital Sculpting'],
  'Problem-Solving': ['Design Thinking', 'Root Cause Analysis', 'Iterative Design', 'User Testing', 'Analytical Thinking', 'Creative Solutions', 'Systems Thinking'],
  'Spatial Awareness': ['3D Thinking', 'Volume Understanding', 'Proportions', 'Scale Design', 'Spatial Reasoning', 'Form Understanding'],
  '3D Thinking': ['Spatial Awareness', 'Visualization', 'Form Understanding', 'Volume Understanding'],
  'Color Theory': ['Aesthetic Design', 'Visual Communication', 'Surface Design'],
  'Sketching': ['Drawing', 'Concept Development', 'Visual Communication', 'Rendering'],
  'Rendering': ['Visualization', 'Presentation Skills', 'Aesthetic Design'],
  'CAD': ['3D Modeling', 'Technical Drawing', 'Precision Design', 'Engineering Principles'],
  'Prototyping': ['Rapid Prototyping', 'Model Making', 'Testing', 'Iteration', 'Fabrication'],
  'Material Understanding': ['Material Science', 'Material Selection', 'Sustainability'],
  'Ergonomics': ['Human Factors', 'User-Centered Design', 'Comfort Design', 'Biomechanics'],
  'User Research': ['Market Analysis', 'Usability Testing', 'Ethnography', 'Data Interpretation'],
  
  // Activities → Skills
  'Prototyping': ['Rapid Prototyping', 'Model Making', 'Testing', 'Iteration'],
  'Collaborating': ['Team Design', 'Cross-Functional Work', 'Feedback Integration', 'Co-Design'],
  'Building': ['Fabrication', 'Assembly', 'Craft Techniques', 'Model Making'],
  'Researching': ['User Research', 'Market Analysis', 'Trend Analysis', 'Data Interpretation'],
  'Problem-Solving': ['Design Thinking', 'Analytical Thinking', 'Creative Solutions', 'Systems Thinking'],
  
  // Design-Specific → Skills
  'Footwear': ['Last Design', 'Pattern Making', 'Upper Construction', 'Sole Engineering', 'Footwear Design', 'Biomechanics'],
  'Furniture': ['Furniture Design', 'Joinery', 'Ergonomics', 'Spatial Design', 'Material Understanding'],
  'Automotive': ['Vehicle Design', 'Aerodynamics', 'Ergonomics', 'Engineering Principles', 'CAD'],
  'Toys & Games': ['Play Patterns', 'Safety Standards', 'Interactive Mechanics', 'Character Systems', 'Character Design', 'Play Design'],
  'Consumer Products': ['Sketching', '3D Modeling', 'Ergonomics', 'Material Selection', 'User Research'],
  'Medical Devices': ['Ergonomics', 'Safety Design', 'Human Factors', 'Precision Design', 'Medical Knowledge'],
  'Electronics': ['Technical Design', 'User Interface', 'Ergonomics', 'Material Science', 'Component Integration'],
  'Packaging': ['Packaging Design', 'Structural Design', 'Material Understanding', 'Sustainability', 'Brand Communication'],
  'Lighting': ['Lighting Design', 'Electrical Understanding', 'Material Science', 'Form Design', 'Optics'],
  'Tools': ['Ergonomics', 'Material Science', 'Durability Design', 'Functionality', 'Safety Design'],
  'Sports Equipment': ['Athletic Equipment Design', 'Biomechanics', 'Performance Design', 'Ergonomics', 'Durability Design'],
  'Outdoor Products': ['Outdoor Equipment Design', 'Durability Design', 'Weather Resistance', 'Portable Design', 'Ergonomics']
};

// BACKWARD: Industry/Subfield → Required Skills
export const BACKWARD_MAPPING: Record<string, string[]> = {
  // Industries
  'Consumer Products': ['Sketching', '3D Modeling', 'Ergonomics', 'Material Selection', 'User Research', 'Market Analysis', 'Aesthetic Design', 'Prototyping', 'Color Theory', 'Form Understanding', 'Packaging Design', 'Brand Understanding', 'Trend Analysis', 'CAD', 'Rendering'],
  'Automotive': ['CAD', 'Aerodynamics', 'Vehicle Architecture', 'CMF', 'Manufacturing Processes', '3D Modeling', 'Ergonomics', 'Material Science', 'Technical Drawing', 'Vehicle Design', 'Performance Design', 'Safety Design', 'Form Understanding', 'Spatial Awareness', 'Engineering Principles', 'Prototyping', 'Rendering', 'Visualization'],
  'Toy & Game Design': ['Character Design', 'Play Design', 'Safety Design', 'Child Psychology', 'Interactive Design', 'Game Design', 'Color Theory', 'Form Understanding', 'Prototyping', 'User Testing', 'Narrative Design', 'Visual Communication', 'Material Understanding', 'Durability Design', 'Educational Design'],
  'Medical Devices': ['FDA Compliance', 'Sterilization', 'Human Factors', 'Biocompatibility', 'Risk Analysis', 'Ergonomics', 'Safety Design', 'Medical Knowledge', 'Precision Design', 'Material Science', 'Regulatory Understanding', 'User Research', 'Accessibility', 'Hygiene Design', 'Technical Documentation', 'Prototyping', 'Testing', 'Biomechanics', 'Assistive Technology'],
  'Electronics': ['PCB Layout', 'Enclosure Design', 'Thermal Management', 'IP Rating', 'Assembly Logic', 'Technical Design', 'Electronics', 'User Interface', 'Ergonomics', 'Material Science', 'Manufacturing Processes', 'Form Factor Design', 'Technical Documentation', 'Prototyping', 'CAD', '3D Modeling', 'User Experience', 'Interface Design', 'Component Integration'],
  'Furniture': ['Joinery', 'Load Analysis', 'Upholstery', 'Flat-Pack Design', 'Ergonomic Seating', 'Furniture Design', 'Ergonomics', 'Material Understanding', 'Spatial Design', 'Form Understanding', 'Craft Techniques', 'Prototyping', '3D Modeling', 'CAD', 'Sustainability', 'Manufacturing Processes', 'Aesthetic Design', 'Functionality', 'Assembly Design'],
  'Footwear': ['Last Design', 'Pattern Making', 'Sole Engineering', 'Upper Construction', 'Biomechanics', 'Footwear Design', 'Material Understanding', 'Ergonomics', 'Performance Design', 'Durability Design', 'Aesthetic Design', 'Prototyping', '3D Modeling', 'Color Theory', 'Form Understanding', 'Manufacturing Processes', 'Fit & Comfort', 'Trend Analysis'],
  'Packaging': ['Packaging Design', 'Structural Design', 'Material Understanding', 'Sustainability', 'Brand Communication', 'Graphic Design', 'Manufacturing Processes', 'Prototyping', 'User Experience', 'Visual Communication', 'Form Understanding', 'Efficiency Design'],
  'Lighting': ['Lighting Design', 'Electrical Understanding', 'Material Science', 'Form Design', 'Aesthetic Design', 'Ergonomics', 'Prototyping', '3D Modeling', 'CAD', 'Optics', 'Energy Efficiency', 'Spatial Design', 'Visual Communication', 'Technical Documentation'],
  'Tools': ['Ergonomics', 'Material Science', 'Manufacturing Processes', 'Durability Design', 'Functionality', 'Safety Design', 'Technical Design', 'Prototyping', 'CAD', '3D Modeling', 'User Research', 'Craft Techniques', 'Precision Design', 'Performance Design'],
  'Sports Equipment': ['Biomechanics', 'Impact Testing', 'Flexibility Design', 'Grip Engineering', 'Lightweight Materials', 'Athletic Equipment Design', 'Performance Design', 'Ergonomics', 'Durability Design', 'Material Science', 'Prototyping', 'Safety Design', 'Aerodynamics', 'Form Understanding', 'Testing', 'User Research', 'Technical Documentation', 'Manufacturing Processes'],
  'Outdoor Products': ['Outdoor Equipment Design', 'Durability Design', 'Weather Resistance', 'Portable Design', 'Lightweight Design', 'Ergonomics', 'Material Science', 'Sustainability', 'Safety Design', 'Functionality', 'Prototyping', 'Adventure Products', 'Environmental Design', 'User Research'],

  // Subfields
  'Footwear Design': ['Last Design', 'Pattern Making', 'Sole Engineering', 'Upper Construction', 'Biomechanics', 'Footwear Design', 'Material Understanding', 'Ergonomics', 'Performance Design', 'Durability Design', 'Aesthetic Design', 'Fit & Comfort', 'Prototyping', '3D Modeling', 'Color Theory', 'Trend Analysis'],
  'Furniture Design': ['Joinery', 'Load Analysis', 'Upholstery', 'Flat-Pack Design', 'Ergonomic Seating', 'Furniture Design', 'Ergonomics', 'Material Understanding', 'Spatial Design', 'Form Understanding', 'Craft Techniques', 'Sustainability', 'Manufacturing Processes', 'Aesthetic Design', 'Prototyping', '3D Modeling', 'CAD', 'Assembly Design'],
  'Transportation Design': ['Vehicle Design', 'Aerodynamics', 'Ergonomics', '3D Modeling', 'CAD', 'Material Science', 'Performance Design', 'Safety Design', 'Form Understanding', 'Spatial Awareness', 'Engineering Principles', 'Prototyping', 'Rendering', 'Visualization', 'Technical Documentation'],
  'Toy Design': ['Character Design', 'Play Design', 'Safety Design', 'Child Psychology', 'Interactive Design', 'Color Theory', 'Form Understanding', 'Prototyping', 'User Testing', 'Narrative Design', 'Durability Design', 'Material Understanding', 'Educational Design', 'Visual Communication'],
  'Medical Device Design': ['Medical Device Design', 'Ergonomics', 'Safety Design', 'Human Factors', 'Precision Design', 'Material Science', 'Regulatory Understanding', 'Medical Knowledge', 'Accessibility', 'Hygiene Design', 'Prototyping', 'Testing', 'Biomechanics', 'Assistive Technology', 'Technical Documentation'],
  'Packaging Design': ['Packaging Design', 'Structural Design', 'Material Understanding', 'Sustainability', 'Brand Communication', 'Graphic Design', 'Manufacturing Processes', 'Prototyping', 'User Experience', 'Visual Communication', 'Efficiency Design', 'Form Understanding'],
  'Lighting Design': ['Lighting Design', 'Electrical Understanding', 'Material Science', 'Form Design', 'Aesthetic Design', 'Optics', 'Energy Efficiency', 'Spatial Design', 'Ergonomics', 'Prototyping', '3D Modeling', 'CAD', 'Visual Communication', 'Technical Documentation'],
  'Tool Design': ['Tool Design', 'Ergonomics', 'Material Science', 'Durability Design', 'Functionality', 'Safety Design', 'Technical Design', 'Precision Design', 'Manufacturing Processes', 'Prototyping', 'CAD', 'User Research', 'Craft Techniques', 'Performance Design', 'Technical Documentation'],
  'Sports Equipment Design': ['Athletic Equipment Design', 'Biomechanics', 'Performance Design', 'Ergonomics', 'Durability Design', 'Material Science', 'Aerodynamics', 'Safety Design', 'Prototyping', 'Testing', 'Form Understanding', 'User Research', 'Technical Documentation', 'Manufacturing Processes'],
  'Outdoor Equipment Design': ['Outdoor Equipment Design', 'Durability Design', 'Weather Resistance', 'Portable Design', 'Lightweight Design', 'Ergonomics', 'Material Science', 'Sustainability', 'Safety Design', 'Functionality', 'Prototyping', 'Adventure Products', 'Environmental Design', 'User Research']
};

// HYBRID SKILL BOOSTS
export const HYBRID_SKILL_WEIGHTS: Record<string, number> = {
  'Generative Systems': 40,
  'Automation Scripts': 35,
  'Prompt Engineering': 35,
  'File-to-Factory': 30,
  'Parametric Design': 30,
  'AI Variant Generation': 40,
  'Parametric Sizing Logic': 30,
  'Style DNA Encoding': 30,
  'Modular System Design': 30,
  'Constraint-Based Generation': 30,
  'User Preference Algorithms': 30,
  'Play Pattern Analysis': 25,
  'Generative Form Systems': 35,
  'Safety Constraint Encoding': 25,
  'Additive Manufacturing': 30,
  'Digital Fabrication': 30,
  'System Design': 35,
  'Generative Design': 40
};

/**
 * Get skills mapped from interests/talents (forward mapping)
 */
export function getForwardMappedSkills(items: string[]): string[] {
  const skills = new Set<string>();
  items.forEach(item => {
    const mapped = FORWARD_MAPPING[item] || [];
    mapped.forEach(skill => skills.add(skill));
  });
  return Array.from(skills);
}

/**
 * Get required skills for industry/subfield (backward mapping)
 */
export function getBackwardMappedSkills(industry: string, subfield: string): string[] {
  const skills = new Set<string>();
  const industrySkills = BACKWARD_MAPPING[industry] || [];
  const subfieldSkills = BACKWARD_MAPPING[subfield] || [];
  industrySkills.forEach(skill => skills.add(skill));
  subfieldSkills.forEach(skill => skills.add(skill));
  return Array.from(skills);
}

/**
 * Calculate skill overlap between student and industry needs
 */
export function calculateSkillOverlap(
  studentSkills: string[],
  requiredSkills: string[]
): { overlap: string[]; overlapRatio: number } {
  const normalizedStudent = studentSkills.map(s => s.toLowerCase());
  const normalizedRequired = requiredSkills.map(s => s.toLowerCase());
  
  const overlap: string[] = [];
  normalizedRequired.forEach(req => {
    const match = normalizedStudent.find(student => 
      student.includes(req) || req.includes(student) || student === req
    );
    if (match) {
      // Find original case version
      const original = requiredSkills.find(r => r.toLowerCase() === req);
      if (original && !overlap.includes(original)) {
        overlap.push(original);
      }
    }
  });
  
  const overlapRatio = requiredSkills.length > 0 ? overlap.length / requiredSkills.length : 0;
  return { overlap, overlapRatio };
}

