const pool = require('../config/db')

const ALLOWED_TASK_FIELDS = ['title', 'description', 'status', 'priority', 'due_date']

const getTasksByUser = async (userId, { status, search }) => {
  const conditions = ['user_id = $1']
  const values = [userId]

  if (status) {
    values.push(status)
    conditions.push(`status = $${values.length}`)
  }

  if (search) {
    values.push(`%${search}%`)
    conditions.push(`title ILIKE $${values.length}`)
  }

  const query = `
    SELECT * FROM tasks
    WHERE ${conditions.join(' AND ')}
    ORDER BY created_at DESC
  `

  const result = await pool.query(query, values)
  return result.rows
}

const getTaskById = async (id, userId) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE id = $1 AND user_id = $2',
    [id, userId]
  )
  return result.rows[0]
}

const createTask = async (userId, data) => {
  const { title, description, status, priority, due_date } = data

  const result = await pool.query(
    `INSERT INTO tasks (user_id, title, description, status, priority, due_date)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING *`,
    [
      userId,
      title,
      description || null,
      status || 'todo',
      priority || 'medium',
      due_date || null
    ]
  )

  return result.rows[0]
}

const updateTask = async (id, userId, data) => {
  const fields = Object.keys(data).filter((key) => ALLOWED_TASK_FIELDS.includes(key))

  if (fields.length === 0) {
    return getTaskById(id, userId)
  }

  const setClauses = fields.map((field, index) => `${field} = $${index + 1}`)
  const values = fields.map((field) => data[field])

  values.push(id, userId)

  const query = `
    UPDATE tasks
    SET ${setClauses.join(', ')}, updated_at = NOW()
    WHERE id = $${values.length - 1} AND user_id = $${values.length}
    RETURNING *
  `

  const result = await pool.query(query, values)
  return result.rows[0]
}

const deleteTask = async (id, userId) => {
  const result = await pool.query(
    'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id',
    [id, userId]
  )
  return result.rows[0]
}

const getDateRangeCondition = (startDate, endDate, values, column = 'created_at') => {
  const conditions = []

  if (startDate) {
    values.push(startDate)
    conditions.push(`${column} >= $${values.length}`)
  }

  if (endDate) {
    values.push(endDate)
    conditions.push(`${column} <= $${values.length}::date + interval '1 day'`)
  }

  return conditions
}

const getSummary = async (userId, { start_date, end_date }) => {
  const values = [userId]
  const conditions = ['user_id = $1', ...getDateRangeCondition(start_date, end_date, values)]
  const whereClause = conditions.join(' AND ')

  const totalsResult = await pool.query(
    `SELECT
       COUNT(*) AS total,
       COUNT(*) FILTER (WHERE status = 'done') AS completed,
       COUNT(*) FILTER (WHERE status = 'in_progress') AS in_progress
     FROM tasks
     WHERE ${whereClause}`,
    values
  )

  const overdueResult = await pool.query(
    `SELECT COUNT(*) AS overdue
     FROM tasks
     WHERE user_id = $1
       AND status != 'done'
       AND due_date IS NOT NULL
       AND due_date < CURRENT_DATE`,
    [userId]
  )

  const totals = totalsResult.rows[0]

  return {
    total: Number(totals.total),
    completed: Number(totals.completed),
    in_progress: Number(totals.in_progress),
    overdue: Number(overdueResult.rows[0].overdue)
  }
}

const getCountByStatus = async (userId, { start_date, end_date }) => {
  const values = [userId]
  const conditions = ['user_id = $1', ...getDateRangeCondition(start_date, end_date, values)]
  const whereClause = conditions.join(' AND ')

  const result = await pool.query(
    `SELECT status, COUNT(*) AS count
     FROM tasks
     WHERE ${whereClause}
     GROUP BY status`,
    values
  )

  return result.rows
}

const getCountByPriority = async (userId, { start_date, end_date }) => {
  const values = [userId]
  const conditions = ['user_id = $1', ...getDateRangeCondition(start_date, end_date, values)]
  const whereClause = conditions.join(' AND ')

  const result = await pool.query(
    `SELECT priority, COUNT(*) AS count
     FROM tasks
     WHERE ${whereClause}
     GROUP BY priority`,
    values
  )

  return result.rows
}

const getCompletionTrend = async (userId, { start_date, end_date }) => {
  const values = [userId]
  const conditions = [
    'user_id = $1',
    "status = 'done'",
    ...getDateRangeCondition(start_date, end_date, values, 'updated_at')
  ]
  const whereClause = conditions.join(' AND ')

  const result = await pool.query(
    `SELECT TO_CHAR(updated_at, 'YYYY-MM-DD') AS date, COUNT(*) AS count
     FROM tasks
     WHERE ${whereClause}
     GROUP BY date
     ORDER BY date ASC`,
    values
  )

  return result.rows
}

const getAllTasksForExport = async (userId) => {
  const result = await pool.query(
    `SELECT id, title, description, status, priority, due_date, created_at, updated_at
     FROM tasks
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [userId]
  )
  return result.rows
}

module.exports = {
  getTasksByUser,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getSummary,
  getCountByStatus,
  getCountByPriority,
  getCompletionTrend,
  getAllTasksForExport
}