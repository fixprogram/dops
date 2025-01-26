import { userCoordinatesAtom } from '@/atoms'
import { useAtom } from 'jotai'
import { useState, useCallback } from 'react'

export const useShareLocation = () => {
  const [, setUserCoordinates] = useAtom(userCoordinatesAtom)
  const [isLoading, setIsLoading] = useState(false)

  const handleSuccess = useCallback(
    (coords: [number, number]) => setUserCoordinates({ value: coords.join(', ') }),
    [setUserCoordinates]
  )
  const handleError = useCallback(
    (error: GeolocationPositionError) =>
      setUserCoordinates(prev => ({ ...prev, error: error.message })),
    [setUserCoordinates]
  )

  const handleShareLocation = useCallback(() => {
    // Add a slight delay before showing the loading spinner to avoid flickering for fast responses
    const loadingTimeout = setTimeout(() => setIsLoading(true), 100)

    navigator.geolocation.getCurrentPosition(
      position => {
        clearTimeout(loadingTimeout)
        setIsLoading(false)
        const { latitude, longitude } = position.coords
        handleSuccess([latitude, longitude])
      },
      error => {
        clearTimeout(loadingTimeout)
        setIsLoading(false)
        handleError?.(error)
      }
    )
  }, [handleSuccess, handleError])

  return { handleShareLocation, isLoading }
}
