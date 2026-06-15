import styles from './Footer.module.css'

const Footer = () => {
  const year = new Date().getFullYear()

  return (
    <footer className={styles.footer}>
      <p className={styles.text}>Task Manager &copy; {year}</p>
    </footer>
  )
}

export default Footer