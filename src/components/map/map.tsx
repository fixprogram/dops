import { useAtom } from 'jotai'
import { useMap } from '../../hooks/useMap'
import { Title } from '../ui/title/title'
import styles from './map.module.css'
import { userCoordinatesAtom, venueCoordinatesAtom } from '../../atoms'
import { useEffect } from 'react'

export const ProjectMap = () => {
  // const [slug] = useAtom(slugAtom)
  const [venueCoordinates] = useAtom(venueCoordinatesAtom)
  const [userCoordinates] = useAtom(userCoordinatesAtom)
  const { addUser, addVenue, removeVenue, removeUser } = useMap()

  useEffect(
    () => (venueCoordinates ? addVenue(venueCoordinates) : removeVenue()),
    [venueCoordinates, addVenue, removeVenue]
  )
  useEffect(
    () =>
      userCoordinates
        ? addUser(userCoordinates.split(', ').map(Number) as [number, number])
        : removeUser(),
    [userCoordinates, addUser, removeUser]
  )

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
