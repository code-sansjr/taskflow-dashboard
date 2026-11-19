import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { ApiError, api, clearSession, setSession } from '@/lib/api'

function jsonResponse(payload, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => payload,
  }
}

describe('api client', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.stubGlobal('fetch', vi.fn())
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    clearSession()
  })

  it('sends the bearer token and serializes query parameters', async () => {
    setSession({ token: 'token-123', user: { id: 1, name: 'Sandro' } })
    fetch.mockResolvedValueOnce(
      jsonResponse({ data: [], meta: { page: 2, per_page: 9, total: 0, last_page: 1 } }),
    )

    const payload = await api.projects.list({ page: 2, per_page: 9, status: undefined })

    expect(fetch).toHaveBeenCalledTimes(1)
    expect(fetch.mock.calls[0][0]).toBe('/api/projects?page=2&per_page=9')
    expect(fetch.mock.calls[0][1].headers).toMatchObject({
      Authorization: 'Bearer token-123',
    })
    expect(payload.meta.page).toBe(2)
  })

  it('does not send authorization on login requests', async () => {
    setSession({ token: 'old-token', user: { id: 1 } })
    fetch.mockResolvedValueOnce(
      jsonResponse({ data: { token: 'new-token', user: { id: 1, name: 'Sandro' } } }),
    )

    await api.auth.login({ email: 'sandro@example.com', password: 'secret123' })

    const [, options] = fetch.mock.calls[0]
    expect(options.headers.Authorization).toBeUndefined()
    expect(JSON.parse(options.body)).toEqual({
      email: 'sandro@example.com',
      password: 'secret123',
    })
  })

  it('returns null for 204 responses', async () => {
    setSession({ token: 'token-123', user: { id: 1 } })
    fetch.mockResolvedValueOnce({ ok: true, status: 204, json: async () => null })

    await expect(api.projects.remove(4)).resolves.toBeNull()
  })

  it('maps validation errors to ApiError with field errors', async () => {
    setSession({ token: 'token-123', user: { id: 1 } })
    fetch.mockResolvedValueOnce(
      jsonResponse(
        {
          error: {
            code: 'validation_error',
            message: 'Validation failed.',
            details: { fields: { name: ['The field is required.'] } },
          },
        },
        422,
      ),
    )

    const error = await api.projects.create({}).catch((caught) => caught)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.status).toBe(422)
    expect(error.code).toBe('validation_error')
    expect(error.fieldErrors.name).toEqual(['The field is required.'])
  })

  it('emits an unauthorized event when a protected request returns 401', async () => {
    setSession({ token: 'expired', user: { id: 1 } })
    const listener = vi.fn()
    window.addEventListener('taskflow:unauthorized', listener)
    fetch.mockResolvedValueOnce(
      jsonResponse(
        { error: { code: 'unauthorized', message: 'Invalid or expired token.' } },
        401,
      ),
    )

    await expect(api.dashboard.get()).rejects.toBeInstanceOf(ApiError)
    expect(listener).toHaveBeenCalledTimes(1)

    window.removeEventListener('taskflow:unauthorized', listener)
  })

  it('converts network failures into a friendly ApiError', async () => {
    setSession({ token: 'token-123', user: { id: 1 } })
    fetch.mockRejectedValueOnce(new TypeError('Failed to fetch'))

    const error = await api.dashboard.get().catch((caught) => caught)

    expect(error).toBeInstanceOf(ApiError)
    expect(error.code).toBe('network_error')
    expect(error.message).toContain('Não foi possível conectar')
  })
})
