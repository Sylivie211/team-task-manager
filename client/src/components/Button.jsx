import styles from './Button.module.css'

const Button = ({
  children,
  type = 'button',
  variant = 'primary',
  onClick,
  disabled = false,
  fullWidth = false
}) => {
  const classNames = [
    styles.button,
    styles[variant],
    fullWidth ? styles.fullWidth : ''
  ].join(' ')

  return (
    <button
      type={type}
      className={classNames}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

export default Button