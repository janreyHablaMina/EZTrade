export const API_BASE = 'http://127.0.0.1:8000';

async function fetchJSON(endpoint: string, options: RequestInit = {}): Promise<any> {
  const response = await fetch(`${API_BASE}/api${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.method === 'POST' || options.method === 'PATCH'
        ? { 'Content-Type': 'application/json' }
        : {}),
      ...options.headers,
    },
  });

  let data: any;
  try {
    data = await response.json();
  } catch {
    throw new Error('Invalid response from server');
  }

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data;
}

export const webApi = {
  get: (endpoint: string) => fetchJSON(endpoint),
  post: (endpoint: string, body?: any) =>
    fetchJSON(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  patch: (endpoint: string, body?: any) =>
    fetchJSON(endpoint, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (endpoint: string) =>
    fetchJSON(endpoint, { method: 'DELETE' }),
};
