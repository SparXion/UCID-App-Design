import { useEffect, useState } from 'react';
import { Briefcase, CheckCircle, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config';

interface CareerPath {
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

export function SkillTreeExplorer({ studentId }: { studentId: string }) {
  const { token } = useAuth();
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!studentId || !token) return;

    // Try proxy first (works in dev with Vite proxy, or production with Netlify redirect)
    const apiUrl = `/api/v1/recommendations/students/${studentId}/paths`;
    // Fallback to direct backend URL
    const backendUrl = `${API_BASE_URL}/api/v1/recommendations/students/${studentId}/paths`;
    
    const headers: HeadersInit = {
      ...(token && { 'Authorization': `Bearer ${token}` })
    };

    fetch(apiUrl, { headers })
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        console.log('Fetched career paths:', data);
        if (Array.isArray(data) && data.length > 0) {
          setPaths(data);
        } else {
          console.warn('Received empty or invalid data:', data);
          setPaths([]);
        }
        setLoading(false);
      })
      .catch(err => {
        console.warn('Proxy failed, trying direct backend URL:', err);
        // Fallback to direct backend URL
        return fetch(backendUrl, { headers })
          .then(res => {
            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }
            return res.json();
          })
          .then(data => {
            console.log('Fetched career paths (direct):', data);
            if (Array.isArray(data) && data.length > 0) {
              setPaths(data);
            } else {
              setPaths([]);
            }
            setLoading(false);
          })
          .catch(fallbackErr => {
            console.error('Failed to fetch career paths:', fallbackErr);
            setError(fallbackErr.message);
            setLoading(false);
          });
      });
  }, [studentId, token]);

  const handleSaveResults = async () => {
    if (!studentId || !token || paths.length === 0) return;

    setSaving(true);
    try {
      // Fetch current student data (talents, interests, hybridMode)
      const studentHeaders: HeadersInit = {
        'Authorization': `Bearer ${token}`
      };

      let studentResponse = await fetch(`/api/v1/students/${studentId}`, { headers: studentHeaders });
      if (!studentResponse.ok) {
        studentResponse = await fetch(`${API_BASE_URL}/api/v1/students/${studentId}`, { headers: studentHeaders });
      }

      if (!studentResponse.ok) {
        throw new Error('Failed to fetch student data');
      }

      const studentData = await studentResponse.json();

      // Prepare quiz data for saving
      const quizData = {
        talents: studentData.talents || [],
        interests: studentData.interests || [],
        hybridMode: studentData.hybridMode || null
      };

      // Save the result
      const saveHeaders: HeadersInit = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };

      const saveBody = {
        quizData: {
          talents: quizData.talents.map((t: any) => ({
            name: t.name,
            measuredScore: t.measuredScore,
            confidence: 'Medium' // Default since we don't store confidence in Talent model
          })),
          interests: quizData.interests.map((i: any) => ({
            topic: i.topic,
            strength: i.strength,
            confidence: 'Medium' // Default since we don't store confidence in Interest model
          })),
          hybridMode: quizData.hybridMode
        }
      };

      let saveResponse = await fetch(`/api/v1/quiz-results`, {
        method: 'POST',
        headers: saveHeaders,
        body: JSON.stringify(saveBody)
      });

      if (!saveResponse.ok) {
        saveResponse = await fetch(`${API_BASE_URL}/api/v1/quiz-results`, {
          method: 'POST',
          headers: saveHeaders,
          body: JSON.stringify(saveBody)
        });
      }

      if (!saveResponse.ok) {
        throw new Error('Failed to save results');
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save results:', error);
      alert('Failed to save results. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-large text-center text-secondary">
        Loading career paths...
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-large text-center">
        <p className="text-body text-secondary mb-small">Error loading career paths</p>
        <p className="text-small text-muted">{error}</p>
        <p className="text-small text-muted mt-small">Make sure the backend is running on port 3001</p>
      </div>
    );
  }

  if (paths.length === 0) {
    return (
      <div className="p-large text-center text-secondary">
        <p className="text-body mb-small">No career paths found</p>
        <p className="text-small text-muted">Try submitting a quiz first</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-medium">
        <h2 className="text-h2">Your Career Path Recommendations</h2>
        <button
          onClick={handleSaveResults}
          disabled={saving || saved}
          className={`btn ${saved ? 'btn-success' : 'btn-primary'} text-small flex items-center gap-small`}
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Results'}
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-medium">
      {paths.map(path => (
        <div
          key={path.id}
          className={`card group cursor-pointer ${path.isHybrid ? 'bg-very-light-gray border-bold' : ''}`}
        >
          {/* Header */}
          <div className="mb-medium">
            <div className="flex justify-between items-start mb-small">
              <div className="flex-1">
                <p className="text-small text-secondary mb-tiny">
                  {path.industry} → {path.subfield}
                </p>
                <h3 className="text-h3 font-semibold mb-small">
                  {path.skillTree}
                </h3>
              </div>
              {path.coopAvailable && (
                <div className="flex-shrink-0 ml-small">
                  <Briefcase className="w-6 h-6 text-black" />
                </div>
              )}
            </div>
            
            {/* Hybrid Badges */}
            {path.isHybrid && (
              <div className="flex gap-1 mb-small">
                <span className="badge bg-black text-white text-tiny border border-black">
                  SYSTEM DESIGN
                </span>
                {path.hybridType && (
                  <span className="badge badge-secondary text-tiny border border-black">
                    {path.hybridType.replace('_', ' ')}
                  </span>
                )}
              </div>
            )}
            
            <span className="badge badge-secondary">
              {path.matchScore}% Match
            </span>
          </div>

          {/* Marketing Blurb */}
          <p className="text-body text-secondary mb-medium leading-tight">
            {path.marketingBlurb}
          </p>

          {/* System Blurb (for hybrid paths) */}
          {path.systemBlurb && (
            <p className="text-small italic text-secondary mb-medium font-medium">
              "{path.systemBlurb}"
            </p>
          )}

          {/* Reasoning */}
          <p className="text-small font-medium mb-medium">
            {path.reasoning}
          </p>

          {/* Industry Required Skills */}
          {path.requiredSkills && path.requiredSkills.length > 0 && (
            <div className="mb-medium">
              <p className="text-tiny text-secondary mb-tiny font-medium">Industry requires:</p>
              <div className="flex flex-wrap gap-1">
                {path.requiredSkills.map(skill => (
                  <span 
                    key={skill} 
                    className="badge badge-secondary text-tiny border border-black"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Student Matched Skills */}
          {path.studentMatchedSkills && path.studentMatchedSkills.length > 0 && (
            <div className="mb-medium p-small bg-bg-gray rounded-subtle border-2 border-black">
              <div className="flex items-center gap-small mb-tiny">
                <CheckCircle className="w-4 h-4" />
                <p className="text-small font-medium text-black">
                  You already have {path.studentMatchedSkills.length} of these!
                </p>
              </div>
              <div className="flex flex-wrap gap-1">
                {path.studentMatchedSkills.map(skill => (
                  <span 
                    key={skill} 
                    className="badge bg-black text-white text-tiny border border-black"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Hybrid Role Indicator */}
          {path.hybridRole && (
            <p className="text-tiny text-secondary mb-medium">
              Your DNA: <span className="font-mono">{path.hybridRole.replace('_', ' ')}</span>
            </p>
          )}

          {/* Specialized Training */}
          {path.specializedTraining && (
            <div className="mb-medium p-small bg-bg-gray rounded-subtle border border-black">
              <p className="text-small font-semibold text-black mb-tiny">
                {path.specializedTraining.title}
              </p>
              {path.specializedTraining.description && (
                <p className="text-small text-secondary">
                  {path.specializedTraining.description}
                </p>
              )}
            </div>
          )}

          {/* Skills Progress */}
          <div className="space-y-small mb-medium">
            {path.skills.map((skill) => (
              <div key={skill.name} className="flex items-center gap-small">
                <span className="text-small w-32 flex-shrink-0">
                  {skill.name}
                </span>
                <div className="progress flex-1">
                  <div
                    className="progress-bar"
                    style={{ width: `${skill.progress}%` }}
                  />
                </div>
                <span className="text-small w-10 text-right flex-shrink-0">
                  {skill.progress}%
                </span>
              </div>
            ))}
          </div>

          {/* CTA Button */}
          <button className="btn btn-primary w-full text-small">
            Start This Path
          </button>
        </div>
      ))}
      </div>
    </>
  );
}

