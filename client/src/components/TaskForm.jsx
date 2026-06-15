import { useState } from 'react'
import Button from './Button.jsx'
import styles from './TaskForm.module.css'

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
]

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
]

const TaskForm = ({ initialValues, onSubmit, onCancel, submitting = false }) => {
  const [title, setTitle] = useState(initialValues?.title || '')
  const [description, setDescription] = useState(initialValues?.description || '')
  const [status, setStatus] = useState(initialValues?.status || 'todo')
  const [priority, setPriority] = useState(initialValues?.priority || 'medium')
  const [dueDate, setDueDate] = useState(initialValues?.due_date || '')

  const handleSubmit = (event) => {
    event.preventDefault()
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      due_date: dueDate || null
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          id="title"
          type="text"
          className={styles.input}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          className={styles.textarea}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          rows={4}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="status" className={styles.label}>
            Status
          </label>
          <select
            id="status"
            className={styles.select}
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            {STATUS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="priority" className={styles.label}>
            Priority
          </label>
          <select
            id="priority"
            className={styles.select}
            value={priority}
            onChange={(event) => setPriority(event.target.value)}
          >
            {PRIORITY_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label htmlFor="dueDate" className={styles.label}>
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            className={styles.input}
            value={dueDate || ''}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button type="submit" variant="primary" disabled={submitting}>
          {submitting ? 'Saving...' : 'Save Task'}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  )
}

export default TaskForm