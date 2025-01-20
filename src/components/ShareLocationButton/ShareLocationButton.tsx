import { FC, useCallback, useState } from 'react'
import styles from './ShareLocationButton.module.css'

export const ShareLocationButton: FC<{
  onSuccess: (coordinates: [number, number]) => void
  onError?: (error: GeolocationPositionError) => void
}> = ({ onSuccess, onError }) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleClick = useCallback(() => {
    // Add a slight delay before showing the loading spinner to avoid flickering for fast responses
    const loadingTimeout = setTimeout(() => setIsLoading(true), 100)

    navigator.geolocation.getCurrentPosition(
      position => {
        clearTimeout(loadingTimeout)
        setIsLoading(false)
        const { longitude, latitude } = position.coords
        onSuccess([longitude, latitude])
      },
      error => {
        clearTimeout(loadingTimeout)
        setIsLoading(false)
        onError?.(error)
      }
    )
  }, [onSuccess, onError])

  return (
    <button
      type="button"
      className={styles.Button}
      onClick={handleClick}
      aria-label="Share location"
      disabled={isLoading}
    >
      {isLoading ? (
        <svg viewBox="0 0 16 16" data-color="blue" className={styles.LoadingIcon}>
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
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={styles.Icon}>
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M15.333 7.333h-1.082a.333.333 0 0 1-.328-.28 6.011 6.011 0 0 0-4.976-4.976.333.333 0 0 1-.28-.328V.667a.667.667 0 0 0-1.334 0v1.082c0 .163-.119.302-.28.328a6.011 6.011 0 0 0-4.976 4.976.333.333 0 0 1-.328.28H.667a.667.667 0 0 0 0 1.334h1.082c.163 0 .302.119.328.28a6.011 6.011 0 0 0 4.976 4.976c.161.025.28.165.28.328v1.082a.667.667 0 1 0 1.334 0v-1.082c0-.163.119-.303.28-.328a6.012 6.012 0 0 0 4.976-4.976.333.333 0 0 1 .328-.28h1.082a.667.667 0 1 0 0-1.334ZM8 12.667a4.667 4.667 0 1 1 0-9.334 4.667 4.667 0 0 1 0 9.334Zm0-2a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"
          />
        </svg>
      )}
    </button>
  )
}
