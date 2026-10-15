import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('api wrapper', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  it('GET calls relative /api path', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => [{ id: 1 }],
    });
    const { get } = await import('../src/lib/api.js');
    const data = await get('/lessons');
    expect(global.fetch).toHaveBeenCalledWith('/api/lessons', expect.any(Object));
    expect(data).toEqual([{ id: 1 }]);
  });

  it('POST sends JSON body', async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ inserted: 1 }),
    });
    const { post } = await import('../src/lib/api.js');
    const data = await post('/lessons/1/attempts', { attempts: [] });
    expect(global.fetch).toHaveBeenCalledWith(
      '/api/lessons/1/attempts',
      expect.objectContaining({ method: 'POST' })
    );
    expect(data).toEqual({ inserted: 1 });
  });

  it('throws on non-ok response with server error', async () => {
    global.fetch.mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ error: 'Lesson not found' }),
    });
    const { get } = await import('../src/lib/api.js');
    await expect(get('/lessons/999')).rejects.toThrow('Lesson not found');
  });
});