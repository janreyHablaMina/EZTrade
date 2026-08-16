import { Platform } from 'react-native';

export const API_BASE_URL = 'http://192.168.100.6:8000';

export const apiClient = {
  async post(endpoint: string, body: any) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(body),
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  },
  async get(endpoint: string) {
    const response = await fetch(`${API_BASE_URL}/api${endpoint}`, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
      },
    });

    let data;
    try {
      data = await response.json();
    } catch (e) {
      throw new Error('Invalid response from server');
    }

    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }

    return data;
  },
};
