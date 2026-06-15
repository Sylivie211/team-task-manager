import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { deleteTask, getTaskById, updateTask } from '../api/taskApi.js'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import TaskForm from '../components/TaskForm.jsx'
import { toInputDateValue } from '../utils/dateHelpers.js'
import styles from './TaskDetail.module.css'

const TaskDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [task, setTask] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const loadTask = async () => {
      setLoading(true)
      setError('')
      try {
        const response = await getTaskById(id)
        setTask(response.data.data)
      } catch {
        setError('Unable to load this task.')
      } finally {
        setLoading(false)
      }
    }

    loadTask()
  }, [id])

  const handleUpdate = async (payload) => {
    setSubmitting(true)
    setError('')
    try {
      const response = await updateTask(id, payload)
      setTask(response.data.data)
      navigate('/tasks')
    } catch {
      setError('Unable to save changes. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteTask(id)
      navigate('/tasks')
    } catch {
      setError('Unable to delete this task.')
    }
  }

  if (loading) {
    return <LoadingSpinner label="Loading task..." />
  }

  if (error && !task) {
    return (
      <div className={styles.page}>
        <ErrorMessage message={error} />
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Edit Task</h1>
        <Button variant="danger" onClick={handleDelete}>
          Delete Task
        </Button>
      </div>

      <ErrorMessage message={error} />

      <Card>
        <TaskForm
          initialValues={{ ...task, due_date: toInputDateValue(task.due_date) }}
          onSubmit={handleUpdate}
          onCancel={() => navigate('/tasks')}
          submitting={submitting}
        />
      </Card>
    </div>
  )
}

export default TaskDetail