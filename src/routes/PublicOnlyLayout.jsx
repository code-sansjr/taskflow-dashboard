import { Navigate, Outlet } from 'react-router-dom'

import LoadingScreen from '@/components/ui/LoadingScreen'
import { useAuth } from '@/context/auth-context'

export default function PublicOnlyLayout() {
  const { user, initializing } = useAuth()

  if (initializing) {
    return <LoadingScreen label="Carregando…" />
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
