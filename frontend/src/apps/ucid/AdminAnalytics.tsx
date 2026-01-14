import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { API_BASE_URL } from '../../config';

interface KpiResponse {
  students: number;
  events: {
    signup: number;
    quiz_complete: number;
    recommendations_viewed: number;
    results_saved: number;
  };
  surveys: {
    pre: number;
    post: number;
  };
  prompts: number;
}

const getStoredAdminKey = () => localStorage.getItem('ucid_admin_key') || '';

export function AdminAnalytics() {
  const { token } = useAuth();
  const [adminKey, setAdminKey] = useState(getStoredAdminKey());
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const [kpis, setKpis] = useState<KpiResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = useMemo(() => {
    const base: HeadersInit = {
      'x-admin-key': adminKey
    };
    if (token) {
      base['Authorization'] = `Bearer ${token}`;
    }
    return base;
  }, [adminKey, token]);

  useEffect(() => {
    localStorage.setItem('ucid_admin_key', adminKey);
  }, [adminKey]);

  const fetchKpis = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (start) params.append('start', start);
      if (end) params.append('end', end);
      const response = await fetch(`${API_BASE_URL}/api/v1/analytics/kpis?${params.toString()}`, {
        headers
      });
      if (!response.ok) {
        throw new Error(`Failed to load KPIs: ${response.status}`);
      }
      const data = await response.json();
      setKpis(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load KPIs');
    } finally {
      setLoading(false);
    }
  };

  const downloadCsv = async (type: 'events' | 'surveys' | 'prompts') => {
    try {
      const params = new URLSearchParams();
      params.append('type', type);
      if (start) params.append('start', start);
      if (end) params.append('end', end);
      const response = await fetch(`${API_BASE_URL}/api/v1/analytics/export?${params.toString()}`, {
        headers
      });
      if (!response.ok) {
        throw new Error(`Export failed: ${response.status}`);
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${type}-export.csv`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      setError(err.message || 'Export failed');
    }
  };

  return (
    <div className="min-h-screen bg-white p-large">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-h1 mb-medium">Admin Analytics</h1>

        <div className="card mb-medium">
          <h2 className="text-h3 mb-small">Access</h2>
          <label className="text-small">Admin Key</label>
          <input
            className="input mt-tiny"
            value={adminKey}
            onChange={(e) => setAdminKey(e.target.value)}
            placeholder="Enter ADMIN_KEY"
          />
          <p className="text-small text-muted mt-tiny">Stored in your browser for convenience.</p>
        </div>

        <div className="card mb-medium">
          <h2 className="text-h3 mb-small">Date Range</h2>
          <div className="grid gap-small md:grid-cols-2">
            <label className="text-small">
              Start (YYYY-MM-DD)
              <input
                className="input mt-tiny"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                placeholder="2026-01-01"
              />
            </label>
            <label className="text-small">
              End (YYYY-MM-DD)
              <input
                className="input mt-tiny"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                placeholder="2026-01-31"
              />
            </label>
          </div>
          <div className="flex gap-small mt-small">
            <button className="btn btn-primary" onClick={fetchKpis} disabled={loading}>
              {loading ? 'Loading...' : 'Refresh KPIs'}
            </button>
          </div>
        </div>

        {error && (
          <div className="card mb-medium">
            <p className="text-small text-danger">{error}</p>
          </div>
        )}

        {kpis && (
          <div className="card mb-medium">
            <h2 className="text-h3 mb-small">KPI Summary</h2>
            <div className="grid gap-small md:grid-cols-2">
              <div className="card">
                <p className="text-small text-secondary">Students</p>
                <p className="text-h2">{kpis.students}</p>
              </div>
              <div className="card">
                <p className="text-small text-secondary">Surveys (Pre/Post)</p>
                <p className="text-h2">{kpis.surveys.pre} / {kpis.surveys.post}</p>
              </div>
              <div className="card">
                <p className="text-small text-secondary">Prompts</p>
                <p className="text-h2">{kpis.prompts}</p>
              </div>
              <div className="card">
                <p className="text-small text-secondary">Events</p>
                <p className="text-small">Signup: {kpis.events.signup}</p>
                <p className="text-small">Quiz Complete: {kpis.events.quiz_complete}</p>
                <p className="text-small">Recommendations Viewed: {kpis.events.recommendations_viewed}</p>
                <p className="text-small">Results Saved: {kpis.events.results_saved}</p>
              </div>
            </div>
          </div>
        )}

        <div className="card">
          <h2 className="text-h3 mb-small">Exports</h2>
          <div className="flex flex-wrap gap-small">
            <button className="btn" onClick={() => downloadCsv('events')}>Download Events CSV</button>
            <button className="btn" onClick={() => downloadCsv('surveys')}>Download Surveys CSV</button>
            <button className="btn" onClick={() => downloadCsv('prompts')}>Download Prompts CSV</button>
          </div>
        </div>
      </div>
    </div>
  );
}
