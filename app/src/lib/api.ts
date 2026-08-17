const API_BASE_URL = 'http://192.168.254.104:8000';

async function fetchJSON(endpoint: string, options: RequestInit = {}): Promise<any> {
  const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
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

export const apiClient = {
  get: (endpoint: string) => fetchJSON(endpoint),
  post: (endpoint: string, body?: any) =>
    fetchJSON(endpoint, { method: 'POST', body: JSON.stringify(body) }),
};

export { API_BASE_URL };
