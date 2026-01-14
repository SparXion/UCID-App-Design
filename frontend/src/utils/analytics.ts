import { API_BASE_URL } from '../config';

const SESSION_KEY = 'ucid_session_id';

export const getSessionId = () => {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
      id = crypto.randomUUID();
    } else {
      id = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    }
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
};

const buildHeaders = (token?: string | null) => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    'x-session-id': getSessionId(),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

export const trackEvent = async (name: string, properties?: Record<string, any>, token?: string | null) => {
  try {
    await fetch(`${API_BASE_URL}/api/v1/events`, {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify({ name, properties })
    });
  } catch (error) {
    // Silent fail - analytics should never block UX
    console.warn('Analytics event failed:', error);
  }
};

export const submitSurvey = async (type: 'PRE' | 'POST', responses: Record<string, any>, token?: string | null) => {
  try {
    await fetch(`${API_BASE_URL}/api/v1/surveys`, {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify({ type, responses })
    });
  } catch (error) {
    console.warn('Survey submission failed:', error);
  }
};

export const submitPrompt = async (promptKey: string, rating?: number, responseText?: string, token?: string | null) => {
  try {
    await fetch(`${API_BASE_URL}/api/v1/prompts`, {
      method: 'POST',
      headers: buildHeaders(token),
      body: JSON.stringify({ promptKey, rating, responseText })
    });
  } catch (error) {
    console.warn('Prompt submission failed:', error);
  }
};
