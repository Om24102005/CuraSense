import { fetchAPI } from './client';

export async function getAdminStats() {
  return fetchAPI<any>('/admin/stats', { method: 'GET' });
}

export async function getAdminUsers() {
  return fetchAPI<any>('/admin/users', { method: 'GET' });
}

export async function deleteAdminUser(id: string) {
  return fetchAPI(`/admin/users/${id}`, { method: 'DELETE' });
}

export async function getAdminPredictions() {
  return fetchAPI<any>('/admin/predictions', { method: 'GET' });
}
