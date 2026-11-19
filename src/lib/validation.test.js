import { describe, expect, it } from 'vitest'

import {
  isValidDateOnly,
  validateLogin,
  validateProject,
  validateRegister,
  validateTask,
} from '@/lib/validation'

describe('validation', () => {
  it('accepts a valid login payload', () => {
    expect(validateLogin({ email: 'sandro@example.com', password: 'secret123' })).toEqual({})
  })

  it('rejects invalid login fields', () => {
    const errors = validateLogin({ email: 'not-an-email', password: '' })

    expect(errors.email).toMatch(/válido/)
    expect(errors.password).toMatch(/senha/)
  })

  it('requires matching passwords on register', () => {
    const errors = validateRegister({
      name: 'Sandro',
      email: 'sandro@example.com',
      password: 'secret123',
      confirmPassword: 'different',
    })

    expect(errors.confirmPassword).toMatch(/não coincidem/)
  })

  it('validates project length limits', () => {
    expect(validateProject({ name: 'A', description: '' }).name).toBeDefined()
    expect(
      validateProject({ name: 'Projeto', description: 'x'.repeat(2001) }).description,
    ).toBeDefined()
  })

  it('validates task due dates and titles', () => {
    expect(
      validateTask({ title: 'Tarefa', description: '', dueDate: '2026-02-30' }).dueDate,
    ).toBeDefined()
    expect(
      validateTask({ title: 'Tarefa', description: '', dueDate: '2026-12-01' }).dueDate,
    ).toBeUndefined()
    expect(validateTask({ title: 'A', description: '', dueDate: '' }).title).toBeDefined()
  })

  it('handles leap years correctly', () => {
    expect(isValidDateOnly('2028-02-29')).toBe(true)
    expect(isValidDateOnly('2026-02-29')).toBe(false)
    expect(isValidDateOnly('19/11/2026')).toBe(false)
  })
})
