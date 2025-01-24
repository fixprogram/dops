import { useAtom } from 'jotai'
import { useMap } from '../../hooks/useMap'
import { Title } from '../ui/Title/Title'
import styles from './ProjectMap.module.css'
import { userCoordinatesAtom, venueCoordinatesAtom } from '../../atoms'
import { useEffect } from 'react'
import { useDebounce } from '../../hooks/useDebounce'
import { validateCoordinates } from '../../utils/validateCoordinates'
import { parseCoordinates } from '../../utils/parseCoordinates'

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
          <Title>Delivery Order Price Calculator</Title>
        </div>
      </div>
    </div>
  )
}
