const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function isValidDateOnly(value) {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false
  }

  const [year, month, day] = value.split('-').map(Number)
  const date = new Date(year, month - 1, day)

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  )
}

export function validateLogin({ email, password }) {
  const errors = {}

  if (!email.trim()) {
    errors.email = 'Informe seu e-mail.'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (!password) {
    errors.password = 'Informe sua senha.'
  }

  return errors
}

export function validateRegister({ name, email, password, confirmPassword }) {
  const errors = {}

  if (name.trim().length < 2) {
    errors.name = 'O nome precisa ter pelo menos 2 caracteres.'
  } else if (name.trim().length > 120) {
    errors.name = 'O nome pode ter no máximo 120 caracteres.'
  }

  if (!email.trim()) {
    errors.email = 'Informe seu e-mail.'
  } else if (!EMAIL_PATTERN.test(email.trim())) {
    errors.email = 'Informe um e-mail válido.'
  }

  if (password.length < 8) {
    errors.password = 'A senha precisa ter pelo menos 8 caracteres.'
  } else if (password.length > 72) {
    errors.password = 'A senha pode ter no máximo 72 caracteres.'
  }

  if (password !== confirmPassword) {
    errors.confirmPassword = 'As senhas não coincidem.'
  }

  return errors
}

export function validateProject({ name, description }) {
  const errors = {}
  const trimmedName = name.trim()

  if (trimmedName.length < 2) {
    errors.name = 'O nome precisa ter pelo menos 2 caracteres.'
  } else if (trimmedName.length > 120) {
    errors.name = 'O nome pode ter no máximo 120 caracteres.'
  }

  if (description.trim().length > 2000) {
    errors.description = 'A descrição pode ter no máximo 2000 caracteres.'
  }

  return errors
}

export function validateTask({ title, description, dueDate }) {
  const errors = {}
  const trimmedTitle = title.trim()

  if (trimmedTitle.length < 2) {
    errors.title = 'O título precisa ter pelo menos 2 caracteres.'
  } else if (trimmedTitle.length > 180) {
    errors.title = 'O título pode ter no máximo 180 caracteres.'
  }

  if (description.trim().length > 5000) {
    errors.description = 'A descrição pode ter no máximo 5000 caracteres.'
  }

  if (dueDate && !isValidDateOnly(dueDate)) {
    errors.dueDate = 'Informe uma data válida.'
  }

  return errors
}
