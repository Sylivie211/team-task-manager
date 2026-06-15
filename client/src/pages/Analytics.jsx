import { useCallback, useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts'
import {
  exportTasksCsv,
  getByPriority,
  getByStatus,
  getCompletionTrend,
  getSummary
} from '../api/analyticsApi.js'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import { getRangeStartDate, getTodayDateValue } from '../utils/dateHelpers.js'
import styles from './Analytics.module.css'

const STATUS_LABELS = {
  todo: 'To Do',
  in_progress: 'In Progress',
  done: 'Done'
}

const PRIORITY_COLORS = {
  low: '#2f855a',
  medium: '#e0a458',
  high: '#c0392b'
}

const RANGE_OPTIONS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: 'custom', label: 'Custom range' }
]

const Analytics = () => {
  const [range, setRange] = useState('7d')
  const [startDate, setStartDate] = useState(getRangeStartDate('7d'))
  const [endDate, setEndDate] = useState(getTodayDateValue())

  const [summary, setSummary] = useState(null)
  const [statusData, setStatusData] = useState([])
  const [priorityData, setPriorityData] = useState([])
  const [trendData, setTrendData] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [exporting, setExporting] = useState(false)

  const loadAnalytics = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = { start_date: startDate, end_date: endDate }

      const [summaryRes, statusRes, priorityRes, trendRes] = await Promise.all([
        getSummary(params),
        getByStatus(params),
        getByPriority(params),
        getCompletionTrend(params)
      ])

      setSummary(summaryRes.data.data)

      setStatusData(
        statusRes.data.data.map((item) => ({
          status: STATUS_LABELS[item.status] || item.status,
          count: Number(item.count)
        }))
      )

      setPriorityData(
        priorityRes.data.data.map((item) => ({
          priority: item.priority,
          count: Number(item.count)
        }))
      )

      setTrendData(
        trendRes.data.data.map((item) => ({
          date: item.date,
          completed: Number(item.count)
        }))
      )
    } catch {
      setError('Unable to load analytics data.')
    } finally {
      setLoading(false)
    }
  }, [startDate, endDate])

  useEffect(() => {
    loadAnalytics()
  }, [loadAnalytics])

  const handleRangeChange = (value) => {
    setRange(value)
    if (value === '7d' || value === '30d') {
      setStartDate(getRangeStartDate(value))
      setEndDate(getTodayDateValue())
    }
  }

  const handleExport = async () => {
    setExporting(true)
    setError('')
    try {
      const response = await exportTasksCsv()
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', 'tasks.csv')
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.URL.revokeObjectURL(url)
    } catch {
      setError('Unable to export tasks right now.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Analytics</h1>
        <Button variant="secondary" onClick={handleExport} disabled={exporting}>
          {exporting ? 'Exporting...' : 'Export CSV'}
        </Button>
      </div>

      <div className={styles.rangeBar}>
        {RANGE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.rangeButton} ${
              range === option.value ? styles.rangeButtonActive : ''
            }`}
            onClick={() => handleRangeChange(option.value)}
          >
            {option.label}
          </button>
        ))}

        {range === 'custom' && (
          <div className={styles.customRange}>
            <input
              type="date"
              className={styles.dateInput}
              value={startDate}
              max={endDate}
              onChange={(event) => setStartDate(event.target.value)}
            />
            <span>to</span>
            <input
              type="date"
              className={styles.dateInput}
              value={endDate}
              min={startDate}
              onChange={(event) => setEndDate(event.target.value)}
            />
          </div>
        )}
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner label="Loading analytics..." />
      ) : (
        <>
          <div className={styles.statsGrid}>
            <Card title="Total Tasks">
              <p className={styles.stat}>{summary?.total ?? 0}</p>
            </Card>
            <Card title="Completed">
              <p className={styles.stat}>{summary?.completed ?? 0}</p>
            </Card>
            <Card title="In Progress">
              <p className={styles.stat}>{summary?.in_progress ?? 0}</p>
            </Card>
            <Card title="Overdue">
              <p className={styles.stat}>{summary?.overdue ?? 0}</p>
            </Card>
          </div>

          <div className={styles.chartsGrid}>
            <Card title="Tasks by Status">
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={statusData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="status" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="var(--color-primary)" />
                </BarChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Tasks by Priority">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={priorityData}
                    dataKey="count"
                    nameKey="priority"
                    outerRadius={90}
                    label
                  >
                    {priorityData.map((entry) => (
                      <Cell
                        key={entry.priority}
                        fill={PRIORITY_COLORS[entry.priority] || '#999999'}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>

            <Card title="Completion Trend" className={styles.fullWidthCard}>
              <ResponsiveContainer width="100%" height={260}>
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="completed"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </>
      )}
    </div>
  )
}

export default Analytics