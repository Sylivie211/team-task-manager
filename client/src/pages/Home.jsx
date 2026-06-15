import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Button from '../components/Button.jsx'
import styles from './Home.module.css'

const Home = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Stay on top of your work</h1>
        <p className={styles.subtitle}>
          Create tasks, track progress, and see how your week is shaping up
          with a built-in analytics dashboard.
        </p>

        <div className={styles.actions}>
          {isAuthenticated ? (
            <Link to="/tasks">
              <Button variant="primary">Go to my tasks</Button>
            </Link>
          ) : (
            <>
              <Link to="/register">
                <Button variant="primary">Get started</Button>
              </Link>
              <Link to="/login">
                <Button variant="secondary">Log in</Button>
              </Link>
            </>
          )}
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <h3>Organize tasks</h3>
          <p>Create, edit, search, and filter tasks by status and priority.</p>
        </div>
        <div className={styles.feature}>
          <h3>Track due dates</h3>
          <p>Spot overdue work at a glance and keep your list current.</p>
        </div>
        <div className={styles.feature}>
          <h3>Visualize progress</h3>
          <p>Charts and summary stats show how your tasks move over time.</p>
        </div>
      </div>
    </div>
  )
}

export default Home