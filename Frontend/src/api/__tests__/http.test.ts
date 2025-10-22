import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiFetch } from '../http';
import { authToken } from '../auth';

beforeEach(() => {
  vi.restoreAllMocks();
});

describe('apiFetch headers', () => {
  it('includes Authorization and x-token when token exists', async () => {
    vi.spyOn(authToken, 'get').mockReturnValue('token123');

    const mockResp = { ok: true, json: vi.fn().mockResolvedValue({ ok: true }), text: vi.fn() } as any;
    const fetchSpy = vi.spyOn(globalThis as any, 'fetch').mockResolvedValue(mockResp);

    await apiFetch('/path');

    expect(fetchSpy).toHaveBeenCalledTimes(1);
    const args = fetchSpy.mock.calls[0];
    const options = args[1];
    expect(options.headers.Authorization).toBe('Bearer token123');
    expect(options.headers['x-token']).toBe('token123');
  });

  it('does not include token headers when no token', async () => {
    vi.spyOn(authToken, 'get').mockReturnValue(null);

    const mockResp = { ok: true, json: vi.fn().mockResolvedValue({ ok: true }), text: vi.fn() } as any;
    const fetchSpy = vi.spyOn(globalThis as any, 'fetch').mockResolvedValue(mockResp);

    await apiFetch('/path');

    const options = fetchSpy.mock.calls[0][1];
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.headers['x-token']).toBeUndefined();
  });
});