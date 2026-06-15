import { Link } from 'react-router-dom'
import Button from './Button.jsx'
import { formatDate, isOverdue } from '../utils/dateHelpers.js'
import styles from './TaskItem.module.css'

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'done', label: 'Done' }
]

const PRIORITY_LABELS = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
}

const TaskItem = ({ task, onStatusChange, onDelete }) => {
  const overdue = isOverdue(task.due_date, task.status)

  return (
    <li className={styles.item}>
      <div className={styles.main}>
        <Link to={`/tasks/${task.id}`} className={styles.title}>
          {task.title}
        </Link>
        <div className={styles.meta}>
          <span className={`${styles.badge} ${styles[`priority_${task.priority}`]}`}>
            {PRIORITY_LABELS[task.priority]}
          </span>
          <span className={`${styles.dueDate} ${overdue ? styles.overdue : ''}`}>
            {formatDate(task.due_date)}
            {overdue ? ' (Overdue)' : ''}
          </span>
        </div>
      </div>

      <div className={styles.actions}>
        <select
          className={styles.statusSelect}
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <Button variant="danger" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </div>
    </li>
  )
}

export default TaskItem