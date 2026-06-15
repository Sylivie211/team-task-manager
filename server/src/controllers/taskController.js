const {
  getTasksByUser,
  getTaskById,
  createTask,
  updateTask,
  deleteTask
} = require('../models/taskModel')
const { validateTaskInput } = require('../utils/validators')

const getTasks = async (req, res, next) => {
  try {
    const { status, search } = req.query
    const tasks = await getTasksByUser(req.userId, { status, search })

    res.status(200).json({ success: true, data: tasks })
  } catch (error) {
    next(error)
  }
}

const getTask = async (req, res, next) => {
  try {
    const task = await getTaskById(req.params.id, req.userId)

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' })
    }

    res.status(200).json({ success: true, data: task })
  } catch (error) {
    next(error)
  }
}

const createNewTask = async (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body)
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError })
    }

    const task = await createTask(req.userId, req.body)

    res.status(201).json({ success: true, data: task, message: 'Task created successfully' })
  } catch (error) {
    next(error)
  }
}

const updateExistingTask = async (req, res, next) => {
  try {
    const validationError = validateTaskInput(req.body, { partial: true })
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError })
    }

    const existingTask = await getTaskById(req.params.id, req.userId)
    if (!existingTask) {
      return res.status(404).json({ success: false, message: 'Task not found' })
    }

    const task = await updateTask(req.params.id, req.userId, req.body)

    res.status(200).json({ success: true, data: task, message: 'Task updated successfully' })
  } catch (error) {
    next(error)
  }
}

const deleteExistingTask = async (req, res, next) => {
  try {
    const deleted = await deleteTask(req.params.id, req.userId)

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Task not found' })
    }

    res.status(200).json({ success: true, data: null, message: 'Task deleted successfully' })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  getTasks,
  getTask,
  createNewTask,
  updateExistingTask,
  deleteExistingTask
}