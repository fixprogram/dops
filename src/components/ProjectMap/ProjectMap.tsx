import { useAtom } from 'jotai'
import { useEffect } from 'react'
import { Text } from '@/shared/components/Text/Text'
import { userCoordinatesAtom, venueCoordinatesAtom } from '@/atoms'
import { useDebounce } from '@/shared/hooks/useDebounce'

import { useMap } from './useMap'

import styles from './ProjectMap.module.scss'
import { parseCoordinates, validateCoordinates } from './ProjectMap.utils'

export const ProjectMap = () => {
  const [venueCoordinates] = useAtom(venueCoordinatesAtom)
  const [{ value: userCoordinates }, setUserCoordinates] = useAtom(userCoordinatesAtom)
  const { addUser, addVenue, removeVenue, removeUser } = useMap()
  const delayedUserCoordinates = useDebounce(userCoordinates)

  useEffect(() => {
    if (!venueCoordinates) return removeVenue()

    addVenue(venueCoordinates)
  }, [venueCoordinates, addVenue, removeVenue])

  useEffect(() => {
    if (!delayedUserCoordinates.length) return removeUser()

    if (!validateCoordinates(delayedUserCoordinates)) {
      removeUser()
      setUserCoordinates({
        value: delayedUserCoordinates,
        error:
          'Please enter latitude and longitude in the format: latitude, longitude (e.g., 60.4475285, 22.2937342)'
      })
      return
    }

    addUser(parseCoordinates(delayedUserCoordinates))
  }, [delayedUserCoordinates, addUser, removeUser, setUserCoordinates])

  return (
    <div className={styles.MapWrapper}>
      <div id="map" className={styles.Map} />

      <div className={styles.Hero}>
        <div className={styles.HeroInner}>
          <Text as="h1" type="title-1">
            Delivery Order Price Calculator
          </Text>
        </div>
      </div>
    </div>
  )
}
