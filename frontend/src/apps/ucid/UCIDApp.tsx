import { useState, useEffect } from 'react';
import { SkillTreeExplorer } from './SkillTreeExplorer';
import { StudentQuiz } from './StudentQuiz';
import { SavedResults } from './SavedResults';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config';

export function UCIDApp() {
  const { student, token, signOut, loading: authLoading } = useAuth();
  const studentId = student?.id;
  const [hasTakenQuiz, setHasTakenQuiz] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'explorer' | 'saved'>('explorer');

  // Don't render if auth is still loading or student ID is missing
  if (authLoading || !studentId || !token) {
    return (
      <div className="min-h-screen bg-white p-large">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-body text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!studentId || !token || authLoading) return;

    // Check if student has taken the quiz
    const checkQuizStatus = async () => {
      try {
        const headers: HeadersInit = {
          'Authorization': `Bearer ${token}`
        };

        // Try proxy first
        let response = await fetch(`/api/v1/students/${studentId}/quiz-status`, { headers });
        
        // Fallback to direct backend URL
        if (!response.ok) {
          response = await fetch(`${API_BASE_URL}/api/v1/students/${studentId}/quiz-status`, { headers });
        }
        
        if (response.ok) {
          const data = await response.json();
          setHasTakenQuiz(data.hasQuiz);
        } else {
          // If endpoint fails, default to false (show quiz)
          setHasTakenQuiz(false);
        }
      } catch (error) {
        // On error, show quiz
        setHasTakenQuiz(false);
      } finally {
        setLoading(false);
      }
    };

    checkQuizStatus();
  }, [studentId, token, authLoading]);

  const handleQuizSubmit = () => {
    setHasTakenQuiz(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-large">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-body text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-large">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-large">
          <h1 className="text-h1">Career Path Explorer</h1>
          <div className="flex items-center gap-medium">
            <span className="text-small text-secondary">
              {student?.name} ({student?.email})
            </span>
            <button
              onClick={signOut}
              className="btn text-small"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        {!hasTakenQuiz ? (
          <>
            <p className="text-body text-secondary mb-medium">
              First, tell us about your talents and interests so we can recommend the best career paths for you.
            </p>
            <StudentQuiz studentId={studentId} onSubmit={handleQuizSubmit} />
          </>
        ) : (
          <>
            <div className="flex gap-small mb-medium">
              <button
                className={`btn text-small ${view === 'explorer' ? 'btn-primary' : ''}`}
                onClick={() => setView('explorer')}
              >
                Career Paths
              </button>
              <button
                className={`btn text-small ${view === 'saved' ? 'btn-primary' : ''}`}
                onClick={() => setView('saved')}
              >
                Saved Results
              </button>
              <button
                className="btn text-small"
                onClick={() => setHasTakenQuiz(false)}
              >
                Retake Quiz
              </button>
            </div>
            
            {view === 'explorer' ? (
              <>
                <p className="text-body text-secondary mb-medium">
                  Discover personalized skill trees based on your talents and interests
                </p>
                <SkillTreeExplorer studentId={studentId} />
              </>
            ) : (
              <SavedResults studentId={studentId} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

