const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const VALID_STATUSES = ['todo', 'in_progress', 'done']
const VALID_PRIORITIES = ['low', 'medium', 'high']
const MIN_PASSWORD_LENGTH = 8

const validateRegisterInput = ({ name, email, password }) => {
  if (!name || !name.trim()) {
    return 'Name is required'
  }

  if (!email || !EMAIL_REGEX.test(email)) {
    return 'A valid email is required'
  }

  if (!password || password.length < MIN_PASSWORD_LENGTH) {
    return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`
  }

  return null
}

const validateLoginInput = ({ email, password }) => {
  if (!email || !EMAIL_REGEX.test(email)) {
    return 'A valid email is required'
  }

  if (!password) {
    return 'Password is required'
  }

  return null
}

const validateTaskInput = (data, { partial = false } = {}) => {
  const { title, status, priority } = data

  if (!partial && (!title || !title.trim())) {
    return 'Title is required'
  }

  if (title !== undefined && !title.trim()) {
    return 'Title cannot be empty'
  }

  if (status !== undefined && !VALID_STATUSES.includes(status)) {
    return `Status must be one of: ${VALID_STATUSES.join(', ')}`
  }

  if (priority !== undefined && !VALID_PRIORITIES.includes(priority)) {
    return `Priority must be one of: ${VALID_PRIORITIES.join(', ')}`
  }

  return null
}

module.exports = {
  validateRegisterInput,
  validateLoginInput,
  validateTaskInput,
  VALID_STATUSES,
  VALID_PRIORITIES
}