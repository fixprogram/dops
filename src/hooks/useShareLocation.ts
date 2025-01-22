import { useState, useCallback } from 'react'

export const useShareLocation = (
  onSuccess: (coordinates: [number, number]) => void,
  onError?: (error: GeolocationPositionError) => void // TODO
) => {
  const [isLoading, setIsLoading] = useState(false)

  const handleShareLocation = useCallback(() => {
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

  return { handleShareLocation, isLoading }
}
