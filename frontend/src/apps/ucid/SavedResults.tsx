import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config';
import { Calendar, Trash2, Eye } from 'lucide-react';

interface CareerPath {
  id: string;
  industry: string;
  subfield: string;
  skillTree: string;
  marketingBlurb: string;
  matchScore: number;
  reasoning: string;
  coopAvailable: boolean;
}

interface QuizResult {
  id: string;
  name: string | null;
  talents: any[];
  interests: any[];
  hybridMode: string | null;
  recommendations: CareerPath[];
  createdAt: string;
}

export function SavedResults({ studentId }: { studentId: string }) {
  const { token } = useAuth();
  const [results, setResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<QuizResult | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!studentId || !token) return;

    const fetchResults = async () => {
      try {
        const headers: HeadersInit = {
          'Authorization': `Bearer ${token}`
        };

        let response = await fetch(`/api/v1/quiz-results`, { headers });
        
        if (!response.ok) {
          response = await fetch(`${API_BASE_URL}/api/v1/quiz-results`, { headers });
        }

        if (response.ok) {
          const data = await response.json();
          setResults(data);
        }
      } catch (error) {
        console.error('Failed to fetch saved results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [studentId, token]);

  const handleDelete = async (resultId: string) => {
    if (!confirm('Are you sure you want to delete this saved result?')) return;

    setDeleting(resultId);
    try {
      const headers: HeadersInit = {
        'Authorization': `Bearer ${token}`
      };

      let response = await fetch(`/api/v1/quiz-results/${resultId}`, {
        method: 'DELETE',
        headers
      });

      if (!response.ok) {
        response = await fetch(`${API_BASE_URL}/api/v1/quiz-results/${resultId}`, {
          method: 'DELETE',
          headers
        });
      }

      if (response.ok) {
        setResults(results.filter(r => r.id !== resultId));
        if (selectedResult?.id === resultId) {
          setSelectedResult(null);
        }
      }
    } catch (error) {
      console.error('Failed to delete result:', error);
      alert('Failed to delete result');
    } finally {
      setDeleting(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-large text-center text-secondary">
        Loading saved results...
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="p-large text-center text-secondary">
        <p className="text-body mb-small">No saved results yet</p>
        <p className="text-small">Complete a quiz and save your results to see them here.</p>
      </div>
    );
  }

  if (selectedResult) {
    return (
      <div className="p-large">
        <div className="flex justify-between items-center mb-medium">
          <div>
            <h2 className="text-h2 mb-tiny">
              {selectedResult.name || `Result from ${formatDate(selectedResult.createdAt)}`}
            </h2>
            <p className="text-small text-secondary">
              {formatDate(selectedResult.createdAt)}
            </p>
          </div>
          <button
            onClick={() => setSelectedResult(null)}
            className="btn text-small"
          >
            ← Back to List
          </button>
        </div>

        <div className="mb-medium">
          <h3 className="text-h3 mb-small">Your Talents</h3>
          <div className="flex flex-wrap gap-tiny">
            {selectedResult.talents.map((talent, i) => (
              <span key={i} className="badge">
                {talent.name}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-medium">
          <h3 className="text-h3 mb-small">Your Interests</h3>
          <div className="flex flex-wrap gap-tiny">
            {selectedResult.interests.map((interest, i) => (
              <span key={i} className="badge">
                {interest.topic}
              </span>
            ))}
          </div>
        </div>

        {selectedResult.hybridMode && (
          <div className="mb-medium">
            <h3 className="text-h3 mb-small">Design Style</h3>
            <p className="text-body">{selectedResult.hybridMode}</p>
          </div>
        )}

        <div>
          <h3 className="text-h3 mb-medium">Career Path Recommendations</h3>
          <div className="space-y-medium">
            {selectedResult.recommendations.map((path) => (
              <div key={path.id} className="card">
                <div className="flex justify-between items-start mb-small">
                  <div>
                    <h4 className="text-h4 mb-tiny">{path.skillTree}</h4>
                    <p className="text-small text-secondary">
                      {path.industry} • {path.subfield}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-h3 text-primary">{path.matchScore}%</div>
                    <div className="text-small text-secondary">Match</div>
                  </div>
                </div>
                <p className="text-body text-secondary mb-small">{path.marketingBlurb}</p>
                <p className="text-small text-muted">{path.reasoning}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-large">
      <h2 className="text-h2 mb-medium">Saved Quiz Results</h2>
      <div className="space-y-small">
        {results.map((result) => (
          <div key={result.id} className="card">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-h3 mb-tiny">
                  {result.name || `Quiz Result`}
                </h3>
                <div className="flex items-center gap-small text-small text-secondary mb-small">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(result.createdAt)}</span>
                </div>
                <div className="flex flex-wrap gap-tiny mb-small">
                  <span className="text-small">
                    {result.talents.length} {result.talents.length === 1 ? 'talent' : 'talents'}
                  </span>
                  <span className="text-small">•</span>
                  <span className="text-small">
                    {result.interests.length} {result.interests.length === 1 ? 'interest' : 'interests'}
                  </span>
                  <span className="text-small">•</span>
                  <span className="text-small">
                    {result.recommendations.length} recommendations
                  </span>
                </div>
                {result.recommendations.length > 0 && (
                  <div className="text-small text-secondary">
                    Top match: {result.recommendations[0].skillTree} ({result.recommendations[0].matchScore}%)
                  </div>
                )}
              </div>
              <div className="flex gap-small">
                <button
                  onClick={() => setSelectedResult(result)}
                  className="btn text-small"
                  title="View details"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(result.id)}
                  disabled={deleting === result.id}
                  className="btn text-small"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

