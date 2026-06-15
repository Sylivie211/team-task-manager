const {
  getSummary,
  getCountByStatus,
  getCountByPriority,
  getCompletionTrend,
  getAllTasksForExport
} = require('../models/taskModel')

const CSV_COLUMNS = [
  'id',
  'title',
  'description',
  'status',
  'priority',
  'due_date',
  'created_at',
  'updated_at'
]

const escapeCsvValue = (value) => {
  if (value === null || value === undefined) return ''

  const stringValue = String(value)
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }

  return stringValue
}

const tasksToCsv = (tasks) => {
  const header = CSV_COLUMNS.join(',')
  const rows = tasks.map((task) =>
    CSV_COLUMNS.map((column) => escapeCsvValue(task[column])).join(',')
  )

  return [header, ...rows].join('\n')
}

const getDateRangeParams = (req) => ({
  start_date: req.query.start_date,
  end_date: req.query.end_date
})

const summary = async (req, res, next) => {
  try {
    const data = await getSummary(req.userId, getDateRangeParams(req))
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

const byStatus = async (req, res, next) => {
  try {
    const data = await getCountByStatus(req.userId, getDateRangeParams(req))
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

const byPriority = async (req, res, next) => {
  try {
    const data = await getCountByPriority(req.userId, getDateRangeParams(req))
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

const completionTrend = async (req, res, next) => {
  try {
    const data = await getCompletionTrend(req.userId, getDateRangeParams(req))
    res.status(200).json({ success: true, data })
  } catch (error) {
    next(error)
  }
}

const exportCsv = async (req, res, next) => {
  try {
    const tasks = await getAllTasksForExport(req.userId)
    const csv = tasksToCsv(tasks)

    res.setHeader('Content-Type', 'text/csv')
    res.setHeader('Content-Disposition', 'attachment; filename="tasks.csv"')
    res.status(200).send(csv)
  } catch (error) {
    next(error)
  }
}

module.exports = {
  summary,
  byStatus,
  byPriority,
  completionTrend,
  exportCsv
}