import { useState } from 'react';
import { Pencil, Sparkles, Code, Settings, Lightbulb, Link2, Star } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config';
import { submitSurvey } from '../../utils/analytics';
import { getSessionId } from '../../utils/analytics';

type InputMode = 'direct' | 'explore';
type Confidence = 'Low' | 'Medium' | 'High';
type Source = 'direct' | 'explored' | 'example';
type HybridMode = 'DIRECT_CREATOR' | 'AI_CURATOR' | 'SYSTEM_ARCHITECT' | 'DESIGN_EXECUTOR';

interface Talent {
  name: string;
  measuredScore: number;
  confidence: Confidence;
  source: Source;
}

interface Interest {
  topic: string;
  strength: number; // 1-5
  confidence: Confidence;
  source: Source;
  mappedConcepts?: string[]; // ID-relevant concepts mapped from everyday interests
}

interface StudentQuizProps {
  studentId: string;
  onSubmit: () => void;
}

// Example cards for exploration - Comprehensive skill categories
const TALENT_EXAMPLES = {
  'Visual/Artistic': [
    'Drawing', 'Sculpting', 'Color Theory', 'Sketching', 'Rendering', 
    'Illustration', 'Typography', 'Graphic Design', 'Visual Storytelling', 'Aesthetic Sense'
  ],
  'Spatial': [
    '3D Thinking', 'Spatial Awareness', 'Visualization', 'Form Understanding',
    'Proportions', 'Scale Perception', 'Depth Perception', 'Spatial Reasoning', 'Volume Understanding'
  ],
  'Problem-Solving': [
    'Analytical Thinking', 'Creative Solutions', 'Systems Thinking', 'User-Centered Design',
    'Critical Thinking', 'Logical Reasoning', 'Pattern Recognition', 'Troubleshooting', 'Innovation'
  ],
  'Technical': [
    'CAD', 'Prototyping', 'Material Understanding', 'Manufacturing Processes',
    'Engineering Principles', 'Technical Drawing', '3D Modeling', 'CNC Machining', 'Rapid Prototyping',
    'Electronics', 'Mechanics', 'Software Tools', 'Technical Documentation'
  ],
  'Communication': [
    'Storytelling', 'Presentation Skills', 'Visual Communication', 'Written Communication',
    'Collaboration', 'Team Leadership', 'Client Relations', 'Public Speaking', 'Documentation'
  ],
  'Research & Analysis': [
    'User Research', 'Market Analysis', 'Trend Analysis', 'Data Interpretation',
    'Ethnography', 'Usability Testing', 'Competitive Analysis', 'Material Research', 'Technology Research'
  ],
  'Craft & Making': [
    'Hand Skills', 'Model Making', 'Woodworking', 'Metalworking', 'Textiles',
    'Ceramics', 'Jewelry Making', 'Fabrication', 'Assembly', 'Finishing Techniques'
  ],
  'Digital Tools': [
    'Procreate', 'Photoshop', 'Illustrator', 'Figma', 'Sketch', 'Adobe XD',
    'Rhino', 'SolidWorks', 'Fusion 360', 'Blender', 'Maya', 'Cinema 4D',
    'Keyshot', 'ZBrush', 'Substance Painter', 'Grasshopper',
    'After Effects', 'Premiere Pro', 'InDesign',
    'TouchDesigner', 'Unreal Engine', 'Unity',
    'Marvelous Designer', 'CAD', '3D Modeling', 'Rendering', 'Programming'
  ]
};

// Mapping everyday interests to ID-relevant concepts - Expanded comprehensive mapping
const EVERYDAY_TO_ID_MAPPING: Record<string, string[]> = {
  // Entertainment & Media
  'Movies': ['Storytelling', 'Narrative Design', 'Visual Communication', 'Character Design', 'Cinematic Aesthetics'],
  'Books': ['Storytelling', 'Research', 'Concept Development', 'User Narratives', 'Content Strategy'],
  'Sci-Fi': ['Futuristic Products', 'Innovation', 'Technology Integration', 'Speculative Design', 'Concept Vehicles'],
  'Fantasy': ['Imaginative Design', 'World Building', 'Themed Products', 'Narrative Products', 'Character Design'],
  'Comics': ['Visual Storytelling', 'Character Design', 'Sequential Art', 'Graphic Communication', 'Pop Culture'],
  'Photography': ['Visual Composition', 'Lighting Design', 'Aesthetic Sense', 'Documentation', 'Visual Communication'],
  'Theater': ['Set Design', 'Props Design', 'Spatial Design', 'Narrative Environments', 'Experience Design'],
  
  // Technology & Innovation
  'Gaming': ['Interactive Products', 'User Experience', 'Interface Design', 'Entertainment Products', 'Game Design'],
  'Coding': ['System Design', 'User Interface', 'Digital Products', 'Software Design', 'Technical Problem Solving'],
  'Robotics': ['Mechanical Design', 'Automation', 'Human-Robot Interaction', 'Technical Systems', 'Innovation'],
  'Drones': ['Aerospace Design', 'Remote Control', 'Technical Systems', 'Portable Technology', 'Innovation'],
  '3D Printing': ['Rapid Prototyping', 'Manufacturing', 'Material Science', 'Technical Design', 'Innovation'],
  
  // Arts & Creativity
  'Art': ['Aesthetic Design', 'Visual Communication', 'Creative Expression', 'Form & Function', 'Visual Language'],
  'Drawing': ['Sketching', 'Visual Communication', 'Concept Development', 'Illustration', 'Design Thinking'],
  'Painting': ['Color Theory', 'Aesthetic Sense', 'Visual Composition', 'Creative Expression', 'Surface Design'],
  'Sculpture': ['3D Form', 'Material Understanding', 'Spatial Design', 'Tactile Design', 'Volume & Mass'],
  'Fashion': ['Textile Design', 'Pattern Making', 'Aesthetic Design', 'Wearable Products', 'Trend Analysis'],
  'Jewelry': ['Small-Scale Design', 'Material Science', 'Aesthetic Detail', 'Craft Techniques', 'Personal Products'],
  
  // Music & Sound
  'Music': ['Audio Products', 'Instrument Design', 'Sound Experience', 'Performance Tools', 'Acoustic Design'],
  'Instruments': ['Musical Product Design', 'Ergonomics', 'Acoustic Engineering', 'Craft Techniques', 'Performance Design'],
  'Podcasts': ['Audio Experience', 'Content Strategy', 'User Experience', 'Media Products', 'Communication Design'],
  
  // Sports & Fitness
  'Sports': ['Athletic Equipment', 'Performance Products', 'Ergonomics', 'Durability Design', 'Biomechanics'],
  'Fitness': ['Exercise Equipment', 'Ergonomics', 'Performance Design', 'Health Products', 'Human Factors'],
  'Yoga': ['Wellness Products', 'Ergonomics', 'Mindful Design', 'Comfort Design', 'Lifestyle Products'],
  'Running': ['Footwear Design', 'Performance Products', 'Biomechanics', 'Durability', 'Athletic Equipment'],
  'Cycling': ['Bicycle Design', 'Transportation', 'Performance Products', 'Safety Design', 'Ergonomics'],
  
  // Food & Cooking
  'Cooking': ['Kitchen Products', 'Food Experience', 'Culinary Tools', 'Dining Design', 'Food Service Design'],
  'Baking': ['Kitchen Tools', 'Precision Design', 'Craft Techniques', 'Food Experience', 'Detail Design'],
  'Coffee': ['Beverage Products', 'Ritual Design', 'Coffee Equipment', 'Experience Design', 'Lifestyle Products'],
  'Food': ['Food Products', 'Packaging Design', 'Food Experience', 'Culinary Tools', 'Service Design'],
  
  // Nature & Environment
  'Nature': ['Sustainable Design', 'Eco-Friendly Products', 'Biomimicry', 'Outdoor Products', 'Environmental Design'],
  'Gardening': ['Garden Tools', 'Outdoor Products', 'Sustainable Design', 'Ergonomics', 'Lifestyle Products'],
  'Hiking': ['Outdoor Equipment', 'Portable Products', 'Durability Design', 'Ergonomics', 'Adventure Products'],
  'Camping': ['Portable Products', 'Outdoor Equipment', 'Compact Design', 'Durability', 'Adventure Products'],
  'Animals': ['Pet Products', 'Wildlife Conservation', 'Animal Welfare Products', 'Biomimicry', 'Animal Behavior'],
  'Cats': ['Pet Products', 'Animal Behavior', 'Comfort Design', 'Interactive Products', 'Animal Welfare'],
  'Dogs': ['Pet Products', 'Animal Behavior', 'Durability Design', 'Interactive Products', 'Ergonomics'],
  'Wildlife': ['Conservation Products', 'Biomimicry', 'Environmental Design', 'Research Tools', 'Wildlife Observation'],
  
  // Travel & Exploration
  'Travel': ['Portable Products', 'Cultural Design', 'Transportation', 'Luggage Design', 'Travel Accessories'],
  'Backpacking': ['Portable Products', 'Lightweight Design', 'Durability', 'Ergonomics', 'Adventure Equipment'],
  'Urban Exploration': ['City Products', 'Urban Furniture', 'Public Space Design', 'Transportation', 'Urban Planning'],
  'Architecture': ['Spatial Design', 'Built Environment', 'Furniture Design', 'Lighting Design', 'Environmental Design'],
  
  // Helping & Service
  'Helping Others': ['Assistive Technology', 'Medical Devices', 'Inclusive Design', 'Accessibility', 'Social Impact'],
  'Healthcare': ['Medical Devices', 'Healthcare Products', 'Ergonomics', 'Safety Design', 'Human-Centered Design'],
  'Education': ['Educational Products', 'Learning Tools', 'Child Products', 'Safety Design', 'Pedagogical Design'],
  'Teaching': ['Educational Tools', 'Learning Products', 'Communication Design', 'User Experience', 'Pedagogy'],
  'Volunteering': ['Social Impact Design', 'Community Products', 'Inclusive Design', 'Accessibility', 'Service Design'],
  
  // Family & Relationships
  'Family': ['Family-Centered Products', 'Safety Design', 'Multi-generational Design', 'Child Products', 'Home Products'],
  'Children': ['Child Products', 'Safety Design', 'Educational Toys', 'Play Design', 'Developmental Products'],
  'Babies': ['Infant Products', 'Safety Design', 'Comfort Design', 'Care Products', 'Developmental Design'],
  'Elderly': ['Assistive Products', 'Accessibility', 'Ergonomics', 'Safety Design', 'Inclusive Design'],
  
  // Magic & Mystery
  'Magic': ['Illusion', 'User Experience', 'Hidden Mechanisms', 'Surprise & Delight', 'Interactive Design'],
  'Puzzles': ['Problem-Solving Products', 'Interactive Design', 'Cognitive Design', 'Game Design', 'Challenge Design'],
  'Mystery': ['Hidden Mechanisms', 'Surprise Design', 'Narrative Products', 'Interactive Design', 'Engagement Design'],
  
  // Science & Research
  'Science': ['Research Tools', 'Laboratory Equipment', 'Scientific Instruments', 'Precision Design', 'Technical Products'],
  'Biology': ['Scientific Instruments', 'Research Tools', 'Biomimicry', 'Medical Devices', 'Laboratory Equipment'],
  'Physics': ['Scientific Instruments', 'Precision Design', 'Technical Products', 'Measurement Tools', 'Research Equipment'],
  'Chemistry': ['Laboratory Equipment', 'Safety Design', 'Precision Design', 'Scientific Instruments', 'Research Tools'],
  
  // Craft & Making
  'Woodworking': ['Furniture Design', 'Craft Techniques', 'Material Understanding', 'Joinery', 'Hand Skills'],
  'Metalworking': ['Metal Products', 'Fabrication', 'Material Science', 'Craft Techniques', 'Technical Design'],
  'Textiles': ['Fabric Design', 'Soft Products', 'Material Understanding', 'Pattern Making', 'Textile Products'],
  'Ceramics': ['Ceramic Products', 'Material Science', 'Form Design', 'Craft Techniques', 'Aesthetic Design'],
  'Sewing': ['Textile Products', 'Pattern Making', 'Craft Techniques', 'Detail Design', 'Fabrication'],
  
  // Lifestyle & Wellness
  'Meditation': ['Wellness Products', 'Mindful Design', 'Comfort Design', 'Lifestyle Products', 'Experience Design'],
  'Wellness': ['Health Products', 'Wellness Design', 'Ergonomics', 'Comfort Design', 'Lifestyle Products'],
  'Minimalism': ['Simple Design', 'Essential Products', 'Aesthetic Design', 'Lifestyle Products', 'Form & Function'],
  'Organization': ['Storage Products', 'System Design', 'Efficiency Design', 'Home Products', 'Organizational Tools'],
  
  // Transportation
  'Cars': ['Automotive Design', 'Transportation', 'Vehicle Design', 'Ergonomics', 'Performance Design'],
  'Motorcycles': ['Vehicle Design', 'Transportation', 'Performance Products', 'Ergonomics', 'Adventure Products'],
  'Public Transit': ['Transportation Design', 'Public Space Design', 'Accessibility', 'Urban Design', 'Service Design'],
  
  // Home & Living
  'Interior Design': ['Furniture Design', 'Home Products', 'Spatial Design', 'Lighting Design', 'Environmental Design'],
  'Home Improvement': ['Home Products', 'Tools', 'DIY Products', 'Ergonomics', 'Craft Techniques'],
  'Decorating': ['Home Products', 'Aesthetic Design', 'Environmental Design', 'Lifestyle Products', 'Visual Design']
};

const INTEREST_EXAMPLES = {
  'Everyday Interests': [
    // Entertainment
    'Movies', 'Books', 'Sci-Fi', 'Fantasy', 'Comics', 'Photography', 'Theater', 'Gaming',
    // Technology
    'Coding', 'Robotics', 'Drones', '3D Printing',
    // Arts & Creativity
    'Art', 'Drawing', 'Painting', 'Sculpture', 'Fashion', 'Jewelry',
    // Music & Sound
    'Music', 'Instruments', 'Podcasts',
    // Sports & Fitness
    'Sports', 'Fitness', 'Yoga', 'Running', 'Cycling',
    // Food & Cooking
    'Cooking', 'Baking', 'Coffee', 'Food',
    // Nature & Environment
    'Nature', 'Gardening', 'Hiking', 'Camping', 'Animals', 'Cats', 'Dogs', 'Wildlife',
    // Travel & Exploration
    'Travel', 'Backpacking', 'Urban Exploration', 'Architecture',
    // Helping & Service
    'Helping Others', 'Healthcare', 'Education', 'Teaching', 'Volunteering',
    // Family & Relationships
    'Family', 'Children', 'Babies', 'Elderly',
    // Magic & Mystery
    'Magic', 'Puzzles', 'Mystery',
    // Science & Research
    'Science', 'Biology', 'Physics', 'Chemistry',
    // Craft & Making
    'Woodworking', 'Metalworking', 'Textiles', 'Ceramics', 'Sewing',
    // Lifestyle & Wellness
    'Meditation', 'Wellness', 'Minimalism', 'Organization',
    // Transportation
    'Cars', 'Motorcycles', 'Public Transit',
    // Home & Living
    'Interior Design', 'Home Improvement', 'Decorating'
  ],
  'Design-Specific': [
    'Consumer Products', 'Automotive', 'Furniture', 'Footwear', 'Toys & Games',
    'Medical Devices', 'Electronics', 'Packaging', 'Lighting', 'Tools',
    'Sports Equipment', 'Outdoor Products', 'Home Products', 'Office Products',
    'Transportation Design', 'Product Design', 'Industrial Design'
  ],
  'Activities': [
    'Sketching', 'Building', 'Researching', 'Collaborating', 'Problem-Solving',
    'Making', 'Prototyping', 'Testing', 'Iterating', 'Presenting',
    'Learning', 'Teaching', 'Mentoring', 'Leading', 'Organizing',
    'Analyzing', 'Synthesizing', 'Conceptualizing', 'Visualizing', 'Communicating'
  ]
};

export function StudentQuiz({ studentId, onSubmit }: StudentQuizProps) {
  const { token } = useAuth();
  const [inputMode, setInputMode] = useState<InputMode | null>(null);
  const [talents, setTalents] = useState<Talent[]>([]);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [hybridMode, setHybridMode] = useState<HybridMode | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [preSurveySubmitted, setPreSurveySubmitted] = useState(() => localStorage.getItem('ucid_pre_survey_done') === 'true');
  const [preSurvey, setPreSurvey] = useState({
    awareness: '',
    confidence: '',
    clarity: '',
    notes: ''
  });
  const [showTalentExamples, setShowTalentExamples] = useState(false);
  const [showInterestExamples, setShowInterestExamples] = useState(false);

  // Mode selection handlers
  const selectMode = (mode: InputMode) => {
    setInputMode(mode);
    if (mode === 'explore') {
      setShowTalentExamples(true);
      setShowInterestExamples(true);
    }
  };

  // Talent handlers
  const addTalent = (name?: string, source: Source = 'direct') => {
    setTalents([...talents, {
      name: name || '',
      measuredScore: 50,
      confidence: 'Medium',
      source
    }]);
  };

  const removeTalent = (index: number) => {
    setTalents(talents.filter((_, i) => i !== index));
  };

  const updateTalent = (index: number, field: keyof Talent, value: string | number | Confidence | Source) => {
    const updated = [...talents];
    updated[index] = { ...updated[index], [field]: value };
    setTalents(updated);
  };

  const selectTalentExample = (example: string) => {
    if (!talents.some(t => t.name === example)) {
      addTalent(example, 'example');
    }
  };

  // Interest handlers
  const addInterest = (topic?: string, source: Source = 'direct') => {
    setInterests([...interests, {
      topic: topic || '',
      strength: 3,
      confidence: 'Medium',
      source
    }]);
  };

  const removeInterest = (index: number) => {
    setInterests(interests.filter((_, i) => i !== index));
  };

  const updateInterest = (index: number, field: keyof Interest, value: string | number | Confidence | Source) => {
    const updated = [...interests];
    updated[index] = { ...updated[index], [field]: value };
    setInterests(updated);
  };

  const selectInterestExample = (example: string) => {
    if (!interests.some(i => i.topic === example)) {
      const mappedConcepts = EVERYDAY_TO_ID_MAPPING[example] || [];
      const newInterest: Interest = {
        topic: example,
        strength: 3,
        confidence: 'Medium',
        source: 'example',
        mappedConcepts
      };
      setInterests([...interests, newInterest]);
    }
  };

  // Get mapped concepts for an interest
  const getMappedConcepts = (topic: string): string[] => {
    return EVERYDAY_TO_ID_MAPPING[topic] || [];
  };

  const handlePreSurveySubmit = async () => {
    if (!preSurvey.awareness || !preSurvey.confidence || !preSurvey.clarity) {
      alert('Please answer all pre-survey questions.');
      return;
    }
    await submitSurvey('PRE', preSurvey, token || undefined);
    localStorage.setItem('ucid_pre_survey_done', 'true');
    setPreSurveySubmitted(true);
  };

  const handleSubmit = async () => {
    // Validate - allow partial completion
    const validTalents = talents.filter(t => t.name.trim());
    const validInterests = interests.filter(i => i.topic.trim());

    if (validTalents.length === 0 && validInterests.length === 0) {
      alert('Please add at least one talent or interest to get started.');
      return;
    }

    setSubmitting(true);
    try {
      // Try proxy first (works in dev with Vite proxy, or production with Netlify redirect)
      const apiUrl = `/api/v1/students/${studentId}/quiz`;
      // Fallback to direct backend URL
      const backendUrl = `${API_BASE_URL}/api/v1/students/${studentId}/quiz`;
      
      const requestBody = {
        talents: validTalents.map(t => ({
          name: t.name,
          measuredScore: t.measuredScore,
          confidence: t.confidence
        })),
        interests: validInterests.map(i => ({
          topic: i.topic,
          strength: i.strength,
          confidence: i.confidence,
          mappedConcepts: i.mappedConcepts || getMappedConcepts(i.topic)
        })),
        hybridMode: hybridMode || undefined
      };

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        'x-session-id': getSessionId(),
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      let response = await fetch(apiUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify(requestBody)
      });

      // If proxy fails, try direct backend URL
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Proxy request failed:', response.status, errorText);
        
        response = await fetch(backendUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify(requestBody)
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Quiz submission failed:', response.status, errorText);
        throw new Error(`Failed to submit quiz: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      console.log('Quiz submission successful:', result);
      onSubmit();
    } catch (error: any) {
      console.error('Quiz submission error:', error);
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
      
      // Provide more helpful error message
      let errorMessage = 'Failed to submit quiz. ';
      if (error.message) {
        errorMessage += error.message;
      } else {
        errorMessage += 'Please check your connection and try again.';
      }
      
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Mode selection screen
  if (inputMode === null) {
    return (
      <div className="max-w-3xl mx-auto p-large">
        <h2 className="text-h2 mb-medium">Tell Us About Yourself</h2>
        <p className="text-body text-secondary mb-large">
          How would you like to share your talents and interests?
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-medium mb-large">
          <div
            className="card cursor-pointer hover:bg-bg-gray transition-standard"
            onClick={() => selectMode('direct')}
          >
            <h3 className="text-h3 mb-small">I have specific ideas</h3>
            <p className="text-small text-secondary">
              I know what I'm good at and what interests me. I'll type them in directly.
            </p>
          </div>

          <div
            className="card cursor-pointer hover:bg-bg-gray transition-standard"
            onClick={() => selectMode('explore')}
          >
            <h3 className="text-h3 mb-small">Help me discover</h3>
            <p className="text-small text-secondary">
              I'm exploring and would like to see examples to help me think about it.
            </p>
          </div>
        </div>

        <p className="text-small text-muted text-center">
          Don't worry—you can always add more or change your answers later.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-large">
      <div className="flex justify-between items-center mb-medium">
        <h2 className="text-h2">Tell Us About Yourself</h2>
        <button
          className="btn text-small"
          onClick={() => setInputMode(null)}
        >
          Change Mode
        </button>
      </div>

      {!preSurveySubmitted && (
        <div className="card mb-large">
          <h3 className="text-h3 mb-small">Quick Pre-Survey</h3>
          <p className="text-small text-secondary mb-small">Help us understand where you're starting.</p>
          <div className="grid gap-small">
            <label className="text-small">
              How aware are you of design career options? (1-5)
              <select
                className="input mt-tiny"
                value={preSurvey.awareness}
                onChange={(e) => setPreSurvey({ ...preSurvey, awareness: e.target.value })}
              >
                <option value="">Select</option>
                {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
            <label className="text-small">
              How confident are you in your current direction? (1-5)
              <select
                className="input mt-tiny"
                value={preSurvey.confidence}
                onChange={(e) => setPreSurvey({ ...preSurvey, confidence: e.target.value })}
              >
                <option value="">Select</option>
                {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
            <label className="text-small">
              How clear are you on next steps? (1-5)
              <select
                className="input mt-tiny"
                value={preSurvey.clarity}
                onChange={(e) => setPreSurvey({ ...preSurvey, clarity: e.target.value })}
              >
                <option value="">Select</option>
                {[1,2,3,4,5].map(v => <option key={v} value={v}>{v}</option>)}
              </select>
            </label>
            <label className="text-small">
              Anything else you'd like us to know?
              <textarea
                className="input mt-tiny"
                value={preSurvey.notes}
                onChange={(e) => setPreSurvey({ ...preSurvey, notes: e.target.value })}
              />
            </label>
            <button className="btn btn-primary" onClick={handlePreSurveySubmit}>
              Submit Pre-Survey
            </button>
          </div>
        </div>
      )}

      {/* Talents Section */}
      <div className="mb-large">
        <div className="flex justify-between items-center mb-small">
          <h3 className="text-h3">Your Talents</h3>
          {inputMode === 'explore' && (
            <button
              className="btn text-small"
              onClick={() => setShowTalentExamples(!showTalentExamples)}
            >
              {showTalentExamples ? 'Hide Examples' : 'Show Examples'}
            </button>
          )}
        </div>
        
        <p className="text-small text-secondary mb-medium">
          {inputMode === 'direct'
            ? 'What are you naturally good at? This could be skills like drawing, sculpting, spatial awareness, problem-solving, or anything else.'
            : 'What comes naturally to you? Select any that resonate, even a little. You can also add your own.'}
        </p>

        {/* Example Cards for Explore Mode */}
        {inputMode === 'explore' && showTalentExamples && (
          <div className="mb-medium">
            {Object.entries(TALENT_EXAMPLES).map(([category, examples]) => (
              <div key={category} className="mb-small">
                <p className="text-small font-medium mb-tiny">{category}</p>
                <div className="flex flex-wrap gap-tiny">
                  {examples.map(example => (
                    <button
                      key={example}
                      className={`btn text-small ${talents.some(t => t.name === example) ? 'btn-primary' : ''}`}
                      onClick={() => selectTalentExample(example)}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {talents.map((talent, index) => (
          <div key={index} className="card mb-small">
            <div className="flex gap-small items-start">
              <div className="flex-1">
                <div className="flex gap-small mb-small">
                  <select
                    className="input flex-1"
                    value={talent.confidence}
                    onChange={(e) => updateTalent(index, 'confidence', e.target.value as Confidence)}
                    title="How confident are you about this?"
                  >
                    <option value="Low">Not Sure</option>
                    <option value="Medium">Somewhat Sure</option>
                    <option value="High">Very Sure</option>
                  </select>
                </div>
                
                {inputMode === 'direct' ? (
                  <input
                    type="text"
                    className="input mb-small w-full"
                    placeholder="e.g., Drawing, Spatial Awareness, Problem Solving"
                    value={talent.name}
                    onChange={(e) => updateTalent(index, 'name', e.target.value)}
                  />
                ) : (
                  <div className="flex gap-small mb-small">
                    <input
                      type="text"
                      className="input flex-1"
                      placeholder="Type or select from examples above"
                      value={talent.name}
                      onChange={(e) => updateTalent(index, 'name', e.target.value)}
                    />
                    {talent.source === 'example' && (
                      <span className="text-small text-secondary flex items-center">From examples</span>
                    )}
                  </div>
                )}
                
                <div className="flex items-center gap-small">
                  <label className="text-small">Skill Level:</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={talent.measuredScore}
                    onChange={(e) => updateTalent(index, 'measuredScore', parseInt(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-small w-12 text-right">{talent.measuredScore}%</span>
                </div>
              </div>
              <button
                className="btn text-small"
                onClick={() => removeTalent(index)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
        
        <button className="btn mb-medium" onClick={() => addTalent()}>
          + Add {inputMode === 'explore' ? 'Your Own Talent' : 'Another Talent'}
        </button>
      </div>

      {/* Interests Section */}
      <div className="mb-large">
        <div className="flex justify-between items-center mb-small">
          <h3 className="text-h3">Your Interests</h3>
          {inputMode === 'explore' && (
            <button
              className="btn text-small"
              onClick={() => setShowInterestExamples(!showInterestExamples)}
            >
              {showInterestExamples ? 'Hide Examples' : 'Show Examples'}
            </button>
          )}
        </div>
        
        <p className="text-small text-secondary mb-medium">
          {inputMode === 'direct'
            ? 'What topics or industries excite you? Rate your interest level from 1 (mildly interested) to 5 (very passionate).'
            : 'What do you enjoy in everyday life? Your hobbies, interests, and passions can connect to industrial design careers. Select any that resonate with you.'}
        </p>
        
        {inputMode === 'explore' && (
          <div className="mb-medium p-small bg-bg-gray rounded-subtle border border-black">
            <div className="flex items-center gap-small mb-tiny">
              <Lightbulb className="w-4 h-4" />
              <p className="text-small font-medium">Unique Approach</p>
            </div>
            <p className="text-tiny text-secondary">
              We connect your everyday interests (movies, travel, helping others, etc.) to industrial design career paths. 
              You don't need to know design terms—just tell us what you love, and we'll show you how it connects to fulfilling ID careers.
            </p>
          </div>
        )}

        {/* Example Cards for Explore Mode */}
        {inputMode === 'explore' && showInterestExamples && (
          <div className="mb-medium">
            {Object.entries(INTEREST_EXAMPLES).map(([category, examples]) => (
              <div key={category} className="mb-small">
                <p className="text-small font-medium mb-tiny">{category}</p>
                <div className="flex flex-wrap gap-tiny">
                  {examples.map(example => (
                    <button
                      key={example}
                      className={`btn text-small ${interests.some(i => i.topic === example) ? 'btn-primary' : ''}`}
                      onClick={() => selectInterestExample(example)}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {interests.map((interest, index) => {
          const mappedConcepts = interest.mappedConcepts || getMappedConcepts(interest.topic);
          const hasMapping = mappedConcepts.length > 0;
          
          return (
            <div key={index} className="card mb-small">
              <div className="flex gap-small items-start">
                <div className="flex-1">
                  <div className="flex gap-small mb-small">
                    <div className="flex-1">
                      {inputMode === 'direct' ? (
                        <input
                          type="text"
                          className="input w-full"
                          placeholder="e.g., Footwear Design, Automotive, Furniture"
                          value={interest.topic}
                          onChange={(e) => {
                            const updated = [...interests];
                            updated[index] = { ...updated[index], topic: e.target.value };
                            setInterests(updated);
                          }}
                        />
                      ) : (
                        <>
                          <input
                            type="text"
                            className="input w-full"
                            placeholder="Type or select from examples above"
                            value={interest.topic}
                            onChange={(e) => {
                              const updated = [...interests];
                              const newTopic = e.target.value;
                              const newMapped = getMappedConcepts(newTopic);
                              updated[index] = { 
                                ...updated[index], 
                                topic: newTopic,
                                mappedConcepts: newMapped.length > 0 ? newMapped : undefined
                              };
                              setInterests(updated);
                            }}
                          />
                          {interest.source === 'example' && (
                            <span className="text-small text-secondary">From examples</span>
                          )}
                        </>
                      )}
                    </div>
                    <select
                      className="input"
                      value={interest.confidence}
                      onChange={(e) => updateInterest(index, 'confidence', e.target.value as Confidence)}
                      title="How confident are you about this?"
                    >
                      <option value="Low">Not Sure</option>
                      <option value="Medium">Somewhat Sure</option>
                      <option value="High">Very Sure</option>
                    </select>
                  </div>
                  
                  {/* Show ID connection for everyday interests */}
                  {inputMode === 'explore' && hasMapping && (
                    <div className="mb-small p-small bg-bg-gray rounded-subtle border border-black">
                      <div className="flex items-center gap-small mb-tiny">
                        <Link2 className="w-4 h-4" />
                        <p className="text-small font-medium">
                          This connects to ID: {mappedConcepts.join(', ')}
                        </p>
                      </div>
                      <p className="text-tiny text-secondary">
                        Your interest in "{interest.topic}" can lead to careers in these design areas
                      </p>
                    </div>
                  )}
                
                <div className="flex items-center gap-small">
                  <label className="text-small">Interest Level:</label>
                  <div className="flex gap-tiny flex-1">
                    {[1, 2, 3, 4, 5].map(level => (
                      <button
                        key={level}
                        className={`btn text-small ${interest.strength === level ? 'btn-primary' : ''}`}
                        onClick={() => updateInterest(index, 'strength', level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <button
                className="btn text-small"
                onClick={() => removeInterest(index)}
              >
                Remove
              </button>
            </div>
          </div>
          );
        })}
        
        <button className="btn mb-medium" onClick={() => addInterest()}>
          + Add {inputMode === 'explore' ? 'Your Own Interest' : 'Another Interest'}
        </button>
      </div>

      {/* Hybrid Mode Selection */}
      <div className="mb-large">
        <h3 className="text-h3 mb-small">Design Style</h3>
        <p className="text-small text-secondary mb-medium">
          Do you want to design products directly, or build systems that design them?
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-small">
          {[
            { mode: 'DIRECT_CREATOR' as HybridMode, label: 'Draw & sculpt the product', icon: Pencil },
            { mode: 'AI_CURATOR' as HybridMode, label: 'Curate AI-generated designs', icon: Sparkles },
            { mode: 'SYSTEM_ARCHITECT' as HybridMode, label: 'Code the system that designs it', icon: Code },
            { mode: 'DESIGN_EXECUTOR' as HybridMode, label: 'Execute & optimize the pipeline', icon: Settings }
          ].map(opt => {
            const IconComponent = opt.icon;
            return (
              <button
                key={opt.mode}
                onClick={() => setHybridMode(opt.mode)}
                className={`card p-medium text-left transition-standard ${hybridMode === opt.mode ? 'card-selected' : ''}`}
              >
                <div className="flex items-center gap-small">
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium text-small">{opt.label}</span>
                </div>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setHybridMode(null)}
          className="btn btn-inactive mt-small w-full"
        >
          Skip for now
        </button>
      </div>

      {/* Submit Button */}
      <div className="flex justify-between items-center">
        <p className="text-small text-muted">
          {talents.length === 0 && interests.length === 0
            ? 'Add at least one talent or interest to continue'
            : `You've added ${talents.filter(t => t.name.trim()).length} talent(s) and ${interests.filter(i => i.topic.trim()).length} interest(s). You can always add more later.`}
        </p>
        <button
          className="btn btn-primary"
          onClick={handleSubmit}
          disabled={submitting || (talents.filter(t => t.name.trim()).length === 0 && interests.filter(i => i.topic.trim()).length === 0)}
        >
          {submitting ? 'Submitting...' : 'See My Recommendations'}
        </button>
      </div>

      {/* How It Works */}
      <div className="mt-xlarge p-medium bg-bg-gray rounded-card border border-black">
        <h3 className="text-h3 mb-small">How Matching Works</h3>
        <p className="text-body text-secondary mb-small">
          We use vector similarity to match your talents and interests with career paths. Your confidence levels help us weight your preferences more accurately.
        </p>
        {inputMode === 'explore' && (
          <div className="mb-small p-small bg-white rounded-subtle border border-black">
            <div className="flex items-center gap-small mb-tiny">
              <Star className="w-4 h-4" />
              <p className="text-small font-medium">Unique Feature: Everyday Interests → ID Careers</p>
            </div>
            <p className="text-tiny text-secondary">
              When you select everyday interests (like movies, travel, or helping others), we automatically map them to relevant industrial design concepts. 
              This means your personal passions connect directly to fulfilling design careers—no design knowledge required!
            </p>
          </div>
        )}
        <ol className="list-decimal list-inside space-y-small text-small text-secondary">
          <li>Your talents and interests (including mapped ID concepts from everyday interests) are converted into a 384-dimensional vector (embedding)</li>
          <li>Each career path (Industry → Subfield → SkillTree) is also converted to a vector</li>
          <li>We calculate cosine similarity between your vector and each career path vector</li>
          <li>Higher confidence entries have more weight in the matching algorithm</li>
          <li>The match score (0-100%) shows how well your profile aligns with each path</li>
        </ol>
      </div>
    </div>
  );
}
