import styles from './LoadingSpinner.module.css'

const LoadingSpinner = ({ label = 'Loading...' }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.spinner} />
      <span className={styles.label}>{label}</span>
    </div>
  )
}

export default LoadingSpinner