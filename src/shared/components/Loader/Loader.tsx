import styles from './Loader.module.scss'

export const Loader = () => {
  return (
    <svg viewBox="0 0 16 16" className={styles.LoadingIcon} data-test-id="loading-spinner">
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
