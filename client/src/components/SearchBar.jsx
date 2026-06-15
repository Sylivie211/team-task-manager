import styles from './SearchBar.module.css'

const SearchBar = ({ value, onChange, placeholder = 'Search tasks...' }) => {
  return (
    <input
      type="text"
      className={styles.input}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
    />
  )
}

export default SearchBar