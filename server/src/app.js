const express = require('express')
const cors = require('cors')
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')
const errorHandler = require('./middleware/errorHandler')

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL
  })
)
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)
app.use('/api/analytics', analyticsRoutes)

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

app.use(errorHandler)

module.exports = app