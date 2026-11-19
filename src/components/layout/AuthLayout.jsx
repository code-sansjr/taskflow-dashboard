import { ChartColumnIncreasing, ListChecks, ShieldCheck } from 'lucide-react'

import Brand from '@/components/ui/Brand'
import ProgressBar from '@/components/ui/ProgressBar'

const FEATURES = [
  {
    icon: ListChecks,
    title: 'Projetos e tarefas em um só fluxo',
    description: 'Crie, organize e conclua sem perder o contexto.',
  },
  {
    icon: ChartColumnIncreasing,
    title: 'Progresso e prazos visíveis',
    description: 'Saiba o que está atrasado e o que vence hoje.',
  },
  {
    icon: ShieldCheck,
    title: 'Autenticação JWT',
    description: 'Cada conta acessa apenas os próprios dados.',
  },
]

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800/80 bg-slate-900/40 shadow-2xl shadow-black/40 backdrop-blur lg:grid-cols-2">
        <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-slate-800/80 bg-slate-950/60 p-10 lg:flex">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-sky-500/10 blur-3xl"
            aria-hidden="true"
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative">
            <Brand />
          </div>

          <div className="relative mt-10">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-sky-400">
              Portfólio Full Stack
            </p>
            <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight tracking-tight text-white">
              Projetos e tarefas, do jeito certo.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
              Um dashboard conectado à TaskFlow API para acompanhar o que importa e entregar
              no prazo.
            </p>

            <ul className="mt-8 space-y-4">
              {FEATURES.map(({ icon: Icon, title: featureTitle, description }) => (
                <li key={featureTitle} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-800/80 text-sky-300">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-medium text-slate-200">
                      {featureTitle}
                    </span>
                    <span className="block text-xs leading-5 text-slate-500">{description}</span>
                  </span>
                </li>
              ))}
            </ul>

            <div className="mt-9 rounded-2xl border border-slate-800/80 bg-slate-900/70 p-4">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-200">TaskFlow API</p>
                <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-500/20">
                  38 testes
                </span>
              </div>
              <p className="mt-1 text-xs text-slate-500">PHP 8.4 · MySQL · PDO · JWT</p>
              <ProgressBar value={100} tone="emerald" className="mt-3" label="Cobertura do projeto" />
            </div>
          </div>

          <p className="relative mt-10 text-xs text-slate-600">
            React · Tailwind CSS · TanStack Query
          </p>
        </aside>

        <main className="p-6 sm:p-10">
          <div className="lg:hidden">
            <Brand />
          </div>

          <div className="mt-8 lg:mt-0">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-400">{subtitle}</p>
          </div>

          <div className="mt-8">{children}</div>

          {footer && <div className="mt-6 text-sm text-slate-400">{footer}</div>}
        </main>
      </div>
    </div>
  )
}
