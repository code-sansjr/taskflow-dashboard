import { Navigate, Outlet, useLocation } from 'react-router-dom'

import LoadingScreen from '@/components/ui/LoadingScreen'
import { useAuth } from '@/context/auth-context'

export default function ProtectedLayout() {
  const { user, initializing } = useAuth()
  const location = useLocation()

  if (initializing) {
    return <LoadingScreen label="Validando sua sessão…" />
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}
