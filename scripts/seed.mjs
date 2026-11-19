#!/usr/bin/env node

const API_URL = (process.env.VITE_API_URL ?? process.env.API_URL ?? 'http://127.0.0.1:8000').replace(
  /\/$/,
  '',
)

const DEMO_USER = {
  name: 'Sandro',
  email: 'demo@taskflow.dev',
  password: 'taskflow123',
}

function isoDate(offsetDays = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

async function request(path, { method = 'GET', body, token } = {}) {
  const headers = {}

  if (body !== undefined) {
    headers['Content-Type'] = 'application/json'
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  })

  if (response.status === 204) {
    return null
  }

  const payload = await response.json().catch(() => null)

  if (!response.ok) {
    const error = new Error(payload?.error?.message ?? `HTTP ${response.status}`)
    error.status = response.status
    error.code = payload?.error?.code
    throw error
  }

  return payload
}

async function authenticate() {
  try {
    const session = await request('/api/auth/login', {
      method: 'POST',
      body: { email: DEMO_USER.email, password: DEMO_USER.password },
    })

    return session.data
  } catch (error) {
    if (error.status === 422) {
      throw new Error(
        'A conta demo já existe com outra senha. Ajuste o banco ou use outro e-mail.',
      )
    }

    if (error.status !== 401) {
      throw error
    }
  }

  try {
    const session = await request('/api/auth/register', {
      method: 'POST',
      body: DEMO_USER,
    })

    return session.data
  } catch (error) {
    if (error.status === 422) {
      throw new Error(
        'A conta demo já existe com outra senha. Ajuste o banco ou use outro e-mail.',
      )
    }

    throw error
  }
}

const PROJECTS = [
  {
    name: 'Portfólio profissional',
    description: 'Projetos e presença online para apresentar meu trabalho como desenvolvedor.',
    tasks: [
      {
        title: 'Publicar TaskFlow API',
        description: 'API REST em PHP puro com PDO, JWT e testes automatizados.',
        status: 'done',
        priority: 'high',
        due_date: isoDate(-3),
      },
      {
        title: 'Criar dashboard React',
        description: 'Consumir a API com React, Tailwind CSS e TanStack Query.',
        status: 'doing',
        priority: 'high',
        due_date: isoDate(2),
      },
      {
        title: 'Configurar deploy do dashboard',
        description: 'Publicar o front-end e apontar VITE_API_URL para a API.',
        status: 'todo',
        priority: 'medium',
        due_date: isoDate(8),
      },
      {
        title: 'Atualizar README do perfil',
        description: 'Adicionar os projetos em destaque e revisar os contatos.',
        status: 'done',
        priority: 'medium',
        due_date: isoDate(-1),
      },
    ],
  },
  {
    name: 'Estudos de PHP',
    description: 'Revisão de fundamentos, banco de dados e qualidade de código.',
    tasks: [
      {
        title: 'Revisar PDO e prepared statements',
        description: 'Praticar consultas com parâmetros e tratamento de erros.',
        status: 'done',
        priority: 'high',
        due_date: isoDate(-5),
      },
      {
        title: 'Praticar testes com PHPUnit',
        description: 'Cobrir fluxos de autenticação e CRUD com testes de integração.',
        status: 'doing',
        priority: 'high',
        due_date: isoDate(1),
      },
      {
        title: 'Estudar tipos e strict_types',
        description: 'Reforçar tipagem, enums e boas práticas no PHP moderno.',
        status: 'todo',
        priority: 'low',
        due_date: isoDate(12),
      },
    ],
  },
  {
    name: 'Organização pessoal',
    description: 'Rotina, compromissos e pequenas metas da semana.',
    tasks: [
      {
        title: 'Planejar a semana',
        description: 'Definir prioridades e blocos de foco no calendário.',
        status: 'done',
        priority: 'medium',
        due_date: isoDate(-2),
      },
      {
        title: 'Renovar assinaturas',
        description: 'Revisar serviços recorrentes e cancelar o que não uso.',
        status: 'todo',
        priority: 'medium',
        due_date: isoDate(4),
      },
      {
        title: 'Ler 30 minutos por dia',
        description: 'Manter o hábito de leitura técnica antes de dormir.',
        status: 'doing',
        priority: 'low',
        due_date: isoDate(-1),
      },
    ],
  },
  {
    name: 'Freelance',
    description: 'Acompanhamento de propostas, escopo e entregas para clientes.',
    tasks: [
      {
        title: 'Alinhar escopo com o cliente',
        description: 'Confirmar requisitos, prazo e critérios de aceite.',
        status: 'doing',
        priority: 'high',
        due_date: isoDate(0),
      },
      {
        title: 'Criar orçamento do projeto',
        description: 'Detalhar horas, tecnologias e valor da proposta.',
        status: 'todo',
        priority: 'high',
        due_date: isoDate(-2),
      },
      {
        title: 'Enviar proposta comercial',
        description: 'Revisar o documento e enviar por e-mail.',
        status: 'done',
        priority: 'medium',
        due_date: isoDate(-4),
      },
    ],
  },
]

async function main() {
  console.log(`TaskFlow Dashboard · seed em ${API_URL}\n`)

  const session = await authenticate()
  const token = session.token

  console.log(`Autenticado como ${session.user.email}`)

  const existing = await request('/api/projects?per_page=1', { token })

  if (existing.meta.total > 0) {
    console.log(
      `A conta demo já tem ${existing.meta.total} projeto(s). Nada foi criado para evitar duplicatas.`,
    )
    console.log(`\nEntre com ${DEMO_USER.email} / ${DEMO_USER.password}`)
    return
  }

  let taskCount = 0

  for (const project of PROJECTS) {
    const created = await request('/api/projects', {
      method: 'POST',
      token,
      body: { name: project.name, description: project.description },
    })

    console.log(`+ Projeto: ${created.data.name}`)

    for (const task of project.tasks) {
      await request(`/api/projects/${created.data.id}/tasks`, {
        method: 'POST',
        token,
        body: task,
      })
      taskCount += 1
    }
  }

  console.log(`\nPronto: ${PROJECTS.length} projetos e ${taskCount} tarefas criados.`)
  console.log(`\nAcesse o dashboard e entre com ${DEMO_USER.email} / ${DEMO_USER.password}`)
}

main().catch((error) => {
  console.error(`\nErro: ${error.message}`)
  console.error('Confirme se a TaskFlow API está rodando em http://127.0.0.1:8000.')
  process.exitCode = 1
})
