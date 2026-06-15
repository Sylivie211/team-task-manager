import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import Button from './Button.jsx'
import styles from './Navbar.module.css'

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <Link to="/" className={styles.brand}>
          Task Manager
        </Link>

        <nav className={styles.links}>
          {isAuthenticated ? (
            <>
              <Link to="/tasks" className={styles.link}>
                Tasks
              </Link>
              <Link to="/dashboard" className={styles.link}>
                Dashboard
              </Link>
              <Link to="/analytics" className={styles.link}>
                Analytics
              </Link>
              <span className={styles.userName}>{user?.name}</span>
              <Button variant="secondary" onClick={handleLogout}>
                Log out
              </Button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.link}>
                Log in
              </Link>
              <Link to="/register">
                <Button variant="primary">Sign up</Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Navbar