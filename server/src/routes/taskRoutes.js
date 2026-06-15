const express = require('express')
const {
  getTasks,
  getTask,
  createNewTask,
  updateExistingTask,
  deleteExistingTask
} = require('../controllers/taskController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware)

router.get('/', getTasks)
router.get('/:id', getTask)
router.post('/', createNewTask)
router.put('/:id', updateExistingTask)
router.delete('/:id', deleteExistingTask)

module.exports = router