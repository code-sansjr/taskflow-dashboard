const API_URL = (import.meta.env.VITE_API_URL ?? '').replace(/\/$/, '')

const TOKEN_KEY = 'taskflow.token'
const USER_KEY = 'taskflow.user'

export class ApiError extends Error {
  constructor(message, { status = 0, code = 'unknown_error', details = {} } = {}) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.code = code
    this.details = details
  }

  get fieldErrors() {
    return this.details?.fields ?? {}
  }
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  try {
    const stored = localStorage.getItem(USER_KEY)
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export function setSession({ token, user }) {
  localStorage.setItem(TOKEN_KEY, token)
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function setStoredUser(user) {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

function toQuery(params = {}) {
  const search = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '' || value === false) {
      return
    }

    search.set(key, value === true ? '1' : String(value))
  })

  const query = search.toString()
  return query ? `?${query}` : ''
}

async function request(path, { method = 'GET', body, auth = true, signal } = {}) {
  const headers = {}

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (auth) {
    const token = getToken()
    if (token) {
      headers.Authorization = `Bearer ${token}`
    }
  }

  let response

  try {
    response = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    })
  } catch (error) {
    if (error.name === 'AbortError') {
      throw error
    }

    throw new ApiError('Não foi possível conectar à API. Verifique se ela está em execução.', {
      code: 'network_error',
    })
  }

  if (response.status === 204) {
    return null
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    if (response.status === 401 && auth) {
      window.dispatchEvent(new Event('taskflow:unauthorized'))
    }

    throw new ApiError(payload?.error?.message ?? 'A API retornou um erro inesperado.', {
      status: response.status,
      code: payload?.error?.code ?? 'api_error',
      details: payload?.error?.details ?? {},
    })
  }

  return payload
}

export const api = {
  auth: {
    login: (credentials) =>
      request('/api/auth/login', { method: 'POST', body: credentials, auth: false }).then(
        (payload) => payload.data,
      ),
    register: (data) =>
      request('/api/auth/register', { method: 'POST', body: data, auth: false }).then(
        (payload) => payload.data,
      ),
    me: () => request('/api/me').then((payload) => payload.data),
  },
  projects: {
    list: (params) => request(`/api/projects${toQuery(params)}`),
    get: (id) => request(`/api/projects/${id}`).then((payload) => payload.data),
    create: (data) =>
      request('/api/projects', { method: 'POST', body: data }).then((payload) => payload.data),
    update: (id, data) =>
      request(`/api/projects/${id}`, { method: 'PATCH', body: data }).then(
        (payload) => payload.data,
      ),
    remove: (id) => request(`/api/projects/${id}`, { method: 'DELETE' }),
  },
  tasks: {
    list: (projectId, params) =>
      request(`/api/projects/${projectId}/tasks${toQuery(params)}`),
    get: (id) => request(`/api/tasks/${id}`).then((payload) => payload.data),
    create: (projectId, data) =>
      request(`/api/projects/${projectId}/tasks`, { method: 'POST', body: data }).then(
        (payload) => payload.data,
      ),
    update: (id, data) =>
      request(`/api/tasks/${id}`, { method: 'PATCH', body: data }).then(
        (payload) => payload.data,
      ),
    remove: (id) => request(`/api/tasks/${id}`, { method: 'DELETE' }),
  },
  dashboard: {
    get: () => request('/api/dashboard').then((payload) => payload.data),
  },
}
