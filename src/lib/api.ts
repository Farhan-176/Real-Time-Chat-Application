import type { Message, User } from '../types';

const apiBase = import.meta.env.VITE_API_URL || '';

async function request<T>(path: string, options: RequestInit = {}, token?: string): Promise<T> {
  const response = await fetch(`${apiBase}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}), ...options.headers },
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || 'Something went wrong.');
  }
  return response.json();
}

export function login(email: string, password: string) {
  return request<{ token: string; user: User }>('/api/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function getCurrentUser(token: string) {
  return request<{ user: User }>('/api/me', {}, token);
}

export function getContacts(token: string) {
  return request<{ contacts: User[] }>('/api/contacts', {}, token);
}

export function getMessages(token: string, contactId: string) {
  return request<{ messages: Message[] }>(`/api/conversations/${contactId}/messages`, {}, token);
}
