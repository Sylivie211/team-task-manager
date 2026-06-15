const express = require('express')
const {
  summary,
  byStatus,
  byPriority,
  completionTrend,
  exportCsv
} = require('../controllers/analyticsController')
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router()

router.use(authMiddleware)

router.get('/summary', summary)
router.get('/by-status', byStatus)
router.get('/by-priority', byPriority)
router.get('/completion-trend', completionTrend)
router.get('/export', exportCsv)

module.exports = router