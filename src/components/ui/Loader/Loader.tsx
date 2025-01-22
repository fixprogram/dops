import styles from './Loader.module.css'

export const Loader = () => {
  return (
    <svg viewBox="0 0 16 16" className={styles.LoadingIcon}>
      <circle
        className={styles.LoadingIconBgPath}
        cx="8"
        cy="8"
        r="5"
        fill="none"
        strokeWidth="1"
      />
      <circle
        className={styles.LoadingIconMainPath}
        cx="8"
        cy="8"
        r="5"
        fill="none"
        strokeWidth="1"
      />
    </svg>
  )
}
