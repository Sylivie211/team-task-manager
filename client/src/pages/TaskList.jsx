import { useCallback, useEffect, useState } from 'react'
import { createTask, deleteTask, getTasks, updateTask } from '../api/taskApi.js'
import Button from '../components/Button.jsx'
import Card from '../components/Card.jsx'
import ErrorMessage from '../components/ErrorMessage.jsx'
import LoadingSpinner from '../components/LoadingSpinner.jsx'
import SearchBar from '../components/SearchBar.jsx'
import TaskForm from '../components/TaskForm.jsx'
import TaskItem from '../components/TaskItem.jsx'
import styles from './TaskList.module.css'

const STATUS_FILTERS = [
  { value: '', label: 'All' },
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
]

const TaskList = () => {
  const [tasks, setTasks] = useState([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const loadTasks = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const params = {}
      if (statusFilter) params.status = statusFilter
      if (search) params.search = search

      const response = await getTasks(params)
      setTasks(response.data.data)
    } catch {
      setError('Unable to load tasks. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [statusFilter, search])

  useEffect(() => {
    loadTasks()
  }, [loadTasks])

  const handleCreate = async (payload) => {
    setSubmitting(true)
    setError('')
    try {
      await createTask(payload)
      setShowForm(false)
      await loadTasks()
    } catch {
      setError('Unable to create task. Please check your input and try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleStatusChange = async (id, status) => {
    try {
      await updateTask(id, { status })
      setTasks((current) =>
        current.map((task) => (task.id === id ? { ...task, status } : task))
      )
    } catch {
      setError('Unable to update task status.')
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteTask(id)
      setTasks((current) => current.filter((task) => task.id !== id))
    } catch {
      setError('Unable to delete task.')
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>My Tasks</h1>
        <Button variant="primary" onClick={() => setShowForm((value) => !value)}>
          {showForm ? 'Close' : 'New Task'}
        </Button>
      </div>

      {showForm && (
        <Card className={styles.formCard}>
          <TaskForm onSubmit={handleCreate} submitting={submitting} />
        </Card>
      )}

      <div className={styles.filters}>
        <SearchBar value={search} onChange={setSearch} />
        <select
          className={styles.statusSelect}
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          {STATUS_FILTERS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <ErrorMessage message={error} />

      {loading ? (
        <LoadingSpinner label="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <Card>
          <p className={styles.empty}>
            You have no tasks yet — create your first one.
          </p>
        </Card>
      ) : (
        <ul className={styles.list}>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onStatusChange={handleStatusChange}
              onDelete={handleDelete}
            />
          ))}
        </ul>
      )}
    </div>
  )
}

export default TaskList