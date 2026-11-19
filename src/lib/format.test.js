import { describe, expect, it } from 'vitest'

import { formatDate, formatDateTime, initials, isOverdue, parseDateOnly, todayISO } from '@/lib/format'

function offsetDate(days) {
  const date = new Date()
  date.setDate(date.getDate() + days)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

describe('format helpers', () => {
  it('formats date-only values without timezone shifts', () => {
    expect(formatDate('2026-11-19')).toBe('19/11/2026')
    expect(parseDateOnly('2026-11-19')?.getDate()).toBe(19)
  })

  it('formats MySQL timestamps', () => {
    expect(formatDateTime('2026-11-19 14:30:00')).toMatch(/19\/11\/2026/)
  })

  it('detects overdue tasks but ignores completed ones', () => {
    const yesterday = offsetDate(-1)

    expect(isOverdue(yesterday, 'todo')).toBe(true)
    expect(isOverdue(yesterday, 'done')).toBe(false)
    expect(isOverdue(todayISO(), 'todo')).toBe(false)
    expect(isOverdue(null, 'todo')).toBe(false)
  })

  it('builds initials from the first two names', () => {
    expect(initials('Sandro Silva')).toBe('SS')
    expect(initials('Sandro')).toBe('S')
    expect(initials('')).toBe('')
  })
})
