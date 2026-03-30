const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  if (!response.ok) {
    if (response.status === 404) throw new Error('NOT_FOUND');
    throw new Error(`API error: ${response.statusText}`);
  }
  return response.json();
}

export const api = {
  getDashboard: (id: number) => apiFetch<any>(`/dashboards/${id}`),
  createDashboard: (data: { name: string }) => apiFetch<any>('/dashboards', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  saveContract: (data: any, id?: number) => apiFetch<any>(id ? `/contracts/${id}` : '/contracts', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  saveInvariant: (data: any, id?: number) => apiFetch<any>(id ? `/invariants/${id}` : '/invariants', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
  saveDefenseAction: (data: any, id?: number) => apiFetch<any>(id ? `/defense-actions/${id}` : '/defense-actions', {
    method: id ? 'PUT' : 'POST',
    body: JSON.stringify(data),
  }),
};
