import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSummary } from '../api/analyticsApi.js'
import Card from '../components/Card.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import styles from './Dashboard.module.css'

const Dashboard = () => {
  const [summary, setSummary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const loadSummary = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getSummary()
        setSummary(response.data.data)
      } catch {
        setError('Unable to load dashboard summary.')
      } finally {
        setLoading(false)
      }
    }

    loadSummary()
  }, [])

  return (
    <div className={styles.page}>
      <h1>Dashboard</h1>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner label="Loading summary..." />
      ) : (
        <div className={styles.grid}>
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
      )}

      <div className={styles.links}>
        <Link to="/tasks" className={styles.link}>
          View all tasks
        </Link>
        <Link to="/analytics" className={styles.link}>
          Open analytics dashboard
        </Link>
      </div>
    </div>
  )
}

export default Dashboard