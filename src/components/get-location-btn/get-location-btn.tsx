import { FC } from 'react'
import styles from './get-location-btn.module.css'

export const GetLocationBtn: FC<{
  onSuccess: (coordinates: [number, number]) => void
  onError?: (error: GeolocationPositionError) => void
}> = ({ onSuccess, onError }) => {
  function success(position: GeolocationPosition) {
    const { longitude, latitude } = position.coords

    onSuccess([longitude, latitude])
  }

  function error(error: GeolocationPositionError) {
    onError?.(error)
  }

  const handleClick = () => {
    navigator.geolocation.getCurrentPosition(success, error)
  }

  return (
    <button
      type="button"
      className={styles.Button}
      onClick={handleClick}
      aria-label="Share location"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" className={styles.Icon}>
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M15.333 7.333h-1.082a.333.333 0 0 1-.328-.28 6.011 6.011 0 0 0-4.976-4.976.333.333 0 0 1-.28-.328V.667a.667.667 0 0 0-1.334 0v1.082c0 .163-.119.302-.28.328a6.011 6.011 0 0 0-4.976 4.976.333.333 0 0 1-.328.28H.667a.667.667 0 0 0 0 1.334h1.082c.163 0 .302.119.328.28a6.011 6.011 0 0 0 4.976 4.976c.161.025.28.165.28.328v1.082a.667.667 0 1 0 1.334 0v-1.082c0-.163.119-.303.28-.328a6.012 6.012 0 0 0 4.976-4.976.333.333 0 0 1 .328-.28h1.082a.667.667 0 1 0 0-1.334ZM8 12.667a4.667 4.667 0 1 1 0-9.334 4.667 4.667 0 0 1 0 9.334Zm0-2a2.667 2.667 0 1 0 0-5.334 2.667 2.667 0 0 0 0 5.334Z"
        ></path>
      </svg>
    </button>
  )
}
