import { NavLink } from 'react-router-dom'
import { Code2, FolderKanban, LayoutDashboard, LogOut, X } from 'lucide-react'

import Brand from '@/components/ui/Brand'
import { useAuth } from '@/context/auth-context'
import { cn } from '@/lib/cn'
import { initials } from '@/lib/format'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/projects', label: 'Projetos', icon: FolderKanban, end: false },
]

export default function Sidebar({ open, onClose }) {
  const { user, logout } = useAuth()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-slate-800/80 bg-slate-950/95 px-5 py-6 transition-transform duration-200 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between">
          <Brand />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-800 hover:text-white lg:hidden"
            aria-label="Fechar menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="mt-8 space-y-1" aria-label="Navegação principal">
          {NAV_ITEMS.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                  isActive
                    ? 'bg-sky-500/10 text-sky-300 ring-1 ring-inset ring-sky-500/20'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-white',
                )
              }
            >
              <Icon className="h-4.5 w-4.5" aria-hidden="true" />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <a
            href="https://github.com/code-sansjr/taskflow-api"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 rounded-xl border border-slate-800/80 px-3 py-2.5 text-xs text-slate-400 transition hover:border-slate-700 hover:text-slate-200"
          >
            <Code2 className="h-4 w-4" aria-hidden="true" />
            <span className="flex-1">TaskFlow API</span>
            <span className="text-slate-600">↗</span>
          </a>

          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/60 p-3">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-sky-400 to-cyan-300 text-xs font-bold text-slate-950">
                {initials(user?.name) || 'TF'}
              </span>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-white">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>

              <button
                type="button"
                onClick={logout}
                className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-800 hover:text-rose-300"
                title="Sair"
                aria-label="Sair da conta"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
