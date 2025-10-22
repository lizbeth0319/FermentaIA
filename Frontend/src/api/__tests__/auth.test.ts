import { describe, it, expect, beforeEach } from 'vitest';
import { authToken } from '../auth';

// Mock de localStorage simple para entorno Node
const store = new Map<string, string>();
const mockLocalStorage = {
  getItem: (k: string) => (store.has(k) ? store.get(k)! : null),
  setItem: (k: string, v: string) => { store.set(k, v); },
  removeItem: (k: string) => { store.delete(k); },
  clear: () => { store.clear(); },
} as unknown as Storage;

beforeEach(() => {
  // @ts-expect-error: asignación global en test
  globalThis.localStorage = mockLocalStorage;
  store.clear();
});

describe('authToken storage helpers', () => {
  it('returns null when no token saved', () => {
    expect(authToken.get()).toBeNull();
  });

  it('sets and gets token', () => {
    authToken.set('abc123');
    expect(authToken.get()).toBe('abc123');
  });

  it('clears token', () => {
    authToken.set('abc123');
    authToken.clear();
    expect(authToken.get()).toBeNull();
  });
});