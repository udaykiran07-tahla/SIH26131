import { Capacitor } from '@capacitor/core';

const DEFAULT_WEB_API = 'http://localhost:5000/api';
const DEFAULT_ANDROID_EMULATOR_API = 'http://10.0.2.2:5000/api';

/**
 * Dynamically resolves the API base URL based on runtime environment:
 * 1. User-configured custom IP/URL from localStorage (great for real physical phones on LAN)
 * 2. NEXT_PUBLIC_API_URL environment variable
 * 3. 10.0.2.2:5000 when running on Android Capacitor (emulator loopback to host machine)
 * 4. localhost:5000 for standard web development
 */
export function getApiBaseUrl() {
  if (typeof window !== 'undefined') {
    try {
      const custom = localStorage.getItem('kisan_custom_api_url');
      if (custom && custom.trim()) {
        let clean = custom.trim().replace(/\/+$/, '');
        if (!clean.endsWith('/api')) clean = `${clean}/api`;
        return clean;
      }
    } catch {
      // localStorage may be disabled
    }
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, '');
  }

  if (typeof window !== 'undefined' && Capacitor?.isNativePlatform && Capacitor.isNativePlatform()) {
    return DEFAULT_ANDROID_EMULATOR_API;
  }

  // When deployed to production (e.g. on Vercel), use same-origin API
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    return `${window.location.origin}/api`;
  }

  return DEFAULT_WEB_API;
}

export function setCustomApiUrl(url) {
  if (typeof window !== 'undefined') {
    try {
      if (url && url.trim()) {
        localStorage.setItem('kisan_custom_api_url', url.trim());
      } else {
        localStorage.removeItem('kisan_custom_api_url');
      }
    } catch (e) {
      console.warn('Could not save custom API url:', e);
    }
  }
}

export function getServerOrigin() {
  const base = getApiBaseUrl();
  return base.replace(/\/api$/, '');
}

/**
 * Common fetch helper with error parsing
 */
async function request(endpoint, options = {}) {
  const base = getApiBaseUrl();
  const url = `${base}${endpoint}`;
  try {
    const res = await fetch(url, options);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || `Request failed with status ${res.status}`);
    }
    return json;
  } catch (error) {
    console.error(`API Error on [${options.method || 'GET'} ${endpoint}]:`, error.message);
    throw error;
  }
}

// ----------------- PREDICTIONS -----------------

export async function uploadAndAnalyze(file) {
  const formData = new FormData();
  formData.append('image', file);

  const res = await request('/predictions', {
    method: 'POST',
    body: formData,
  });
  return res.data;
}

export async function getPrediction(id) {
  const res = await request(`/predictions/${id}`);
  return res.data;
}

export async function getPredictionHistory(page = 1, limit = 20) {
  const res = await request(`/predictions?page=${page}&limit=${limit}`);
  return res.data;
}

export async function submitFarmerFeedback(id, helpful, comment) {
  const res = await request(`/predictions/${id}/feedback`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ helpful, comment }),
  });
  return res.data;
}

// ----------------- CROPS & CONDITIONS -----------------

export async function getCrops() {
  const res = await request('/crops');
  return res.data;
}

export async function getConditions(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await request(`/conditions${query ? `?${query}` : ''}`);
  return res.data;
}

export async function getConditionById(id) {
  const res = await request(`/conditions/${id}`);
  return res.data;
}

export async function createCondition(conditionData, token) {
  const res = await request('/conditions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(conditionData),
  });
  return res.data;
}

export async function deleteCondition(id, token) {
  const res = await request(`/conditions/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// ----------------- DATASETS -----------------

export async function getDatasetSamples(params = {}) {
  const query = new URLSearchParams(params).toString();
  const res = await request(`/datasets${query ? `?${query}` : ''}`);
  return res.data;
}

export async function uploadDatasetSample(formData, token) {
  const res = await request('/datasets', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: formData,
  });
  return res.data;
}

export async function bulkUploadDatasetCsv(rows, token) {
  const res = await request('/datasets/bulk-csv', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ rows }),
  });
  return res.data;
}

export async function deleteDatasetSample(id, token) {
  const res = await request(`/datasets/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// ----------------- DASHBOARD & MODELS -----------------

export async function getDashboardStats() {
  const res = await request('/dashboard/stats');
  return res.data;
}

export async function getModelVersions() {
  const res = await request('/models');
  return res.data;
}

export async function createModelVersion(data, token) {
  const res = await request('/models', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  return res.data;
}

// ----------------- ADMIN AUTH -----------------

export async function adminLogin(username, password) {
  const res = await request('/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return res.data;
}
