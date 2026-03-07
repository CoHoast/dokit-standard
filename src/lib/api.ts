// API configuration for Client Dashboard
// Uses Super Admin API via environment variable

const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
  }
  return process.env.NEXT_PUBLIC_ADMIN_API_URL || '';
};

const getClientId = () => {
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_CLIENT_ID || '';
  }
  return process.env.NEXT_PUBLIC_CLIENT_ID || '';
};

export const API_URL = getApiUrl();
export const CLIENT_ID = getClientId();

// Helper function for API calls
export async function apiCall(endpoint: string, options?: RequestInit) {
  const url = `${API_URL}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  return response;
}

// Add client_id to request body automatically
export async function apiPost(endpoint: string, data: Record<string, unknown>) {
  return apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify({
      ...data,
      client_id: parseInt(CLIENT_ID) || data.client_id,
    }),
  });
}

export async function apiPut(endpoint: string, data: Record<string, unknown>) {
  return apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export async function apiGet(endpoint: string) {
  return apiCall(endpoint);
}
