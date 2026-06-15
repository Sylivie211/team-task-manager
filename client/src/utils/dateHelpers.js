export const formatDate = (dateString) => {
  if (!dateString) return 'No due date'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const isOverdue = (dueDate, status) => {
  if (!dueDate || status === 'done') return false
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return new Date(dueDate) < today
}

export const toInputDateValue = (dateString) => {
  if (!dateString) return ''
  return dateString.slice(0, 10)
}

export const getRangeStartDate = (rangeKey) => {
  const today = new Date()
  const start = new Date(today)

  if (rangeKey === '7d') {
    start.setDate(today.getDate() - 7)
  } else if (rangeKey === '30d') {
    start.setDate(today.getDate() - 30)
  }

  return start.toISOString().slice(0, 10)
}

export const getTodayDateValue = () => {
  return new Date().toISOString().slice(0, 10)
}