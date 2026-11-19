import { useCallback, useEffect, useMemo, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import { AuthContext } from '@/context/auth-context'
import {
  api,
  clearSession,
  getStoredUser,
  getToken,
  setSession,
  setStoredUser,
} from '@/lib/api'

export default function AuthProvider({ children }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState(() => getStoredUser())
  const [initializing, setInitializing] = useState(() => Boolean(getToken()))

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
    queryClient.clear()
  }, [queryClient])

  useEffect(() => {
    const handleUnauthorized = () => logout()

    window.addEventListener('taskflow:unauthorized', handleUnauthorized)
    return () => window.removeEventListener('taskflow:unauthorized', handleUnauthorized)
  }, [logout])

  useEffect(() => {
    if (!getToken()) {
      return
    }

    let active = true

    api.auth
      .me()
      .then((currentUser) => {
        if (active) {
          setUser(currentUser)
          setStoredUser(currentUser)
        }
      })
      .catch((error) => {
        if (active && error.status === 401) {
          logout()
        }
      })
      .finally(() => {
        if (active) {
          setInitializing(false)
        }
      })

    return () => {
      active = false
    }
  }, [logout])

  const login = useCallback(
    async (credentials) => {
      const session = await api.auth.login(credentials)
      setSession(session)
      setUser(session.user)
      queryClient.clear()
      return session.user
    },
    [queryClient],
  )

  const register = useCallback(
    async (data) => {
      const session = await api.auth.register(data)
      setSession(session)
      setUser(session.user)
      queryClient.clear()
      return session.user
    },
    [queryClient],
  )

  const value = useMemo(
    () => ({ user, initializing, login, register, logout }),
    [user, initializing, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
