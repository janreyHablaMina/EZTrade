const API_BASE_URL = 'http://192.168.254.104:8000';

async function fetchJSON(endpoint: string, options: RequestInit = {}): Promise<any> {
  const fetchPromise = fetch(`${API_BASE_URL}/api${endpoint}`, {
    ...options,
    headers: {
      Accept: 'application/json',
      ...(options.method === 'POST' ? { 'Content-Type': 'application/json' } : {}),
      ...options.headers,
    },
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error('Request timed out. Please check your connection.')), 10000);
  });

  try {
    const response = (await Promise.race([fetchPromise, timeoutPromise])) as Response;

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
  } catch (error: any) {
    throw error;
  }
}

export const apiClient = {
  get: (endpoint: string) => fetchJSON(endpoint),
  post: (endpoint: string, body?: any) =>
    fetchJSON(endpoint, { method: 'POST', body: JSON.stringify(body) }),
};

export { API_BASE_URL };
