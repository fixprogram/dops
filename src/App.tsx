import { useCallback, useEffect, useMemo, useState } from 'react'
import { useVenueData } from './hooks/useVenueData'

import 'mapbox-gl/dist/mapbox-gl.css'
import { useMap } from './hooks/useMap'
import { Title } from './components/ui/title/title'

import styles from './App.module.css'
import { Total } from './components/total/total'
import { DetailsForm } from './components/details-form/details-form'

function App() {
  const [formData, setFormData] = useState({
    slug: {
      value: '',
      error: null
    },
    cart: {
      value: undefined,
      error: null
    },
    userCoordinates: {
      value: '',
      error: null
    }
  })
  const { slug, cart, userCoordinates } = formData

  const { mapContainerRef, addPoint, distance } = useMap()
  const { orderMinimumNoSurcharge, basePrice, distanceRanges, fetchData } = useVenueData(addPoint) // TODO: change on onSuccess

  console.log('distance: ', distance)

  const getLocation = useCallback(() => {
    fetchData(slug.value.trim())
  }, [slug, fetchData])

  useEffect(() => {
    if (userCoordinates.value) {
      const coords = userCoordinates.value.trim().split(', ').map(Number) as [number, number]

      addPoint(coords, true)
    }
  }, [userCoordinates, addPoint])

  useEffect(() => {
    if (slug.value.trim().length) {
      getLocation()
    }
  }, [slug.value, getLocation])

  const deliveryFee = useMemo(() => {
    if (distance && distanceRanges && basePrice) {
      const range = distanceRanges.find(({ min, max }) => distance >= min && distance < max)

      if (range) {
        return basePrice + range.a + (range.b * distance) / 10
      }
    }
  }, [basePrice, distanceRanges, distance])

  const smallOrderSurcharge = useMemo(() => {
    if (orderMinimumNoSurcharge !== undefined) {
      return orderMinimumNoSurcharge > Number(cart.value ?? 0)
        ? orderMinimumNoSurcharge - Number(cart.value ?? 0)
        : 0
    }
  }, [orderMinimumNoSurcharge, cart])

  return (
    <>
      <div className={styles.MapWrapper}>
        {/* <div id="map-container" className={styles.Map} /> */}
        <div id="map" className={styles.Map} ref={mapContainerRef} />

        <div className={styles.Hero}>
          <div className={styles.HeroInner}>
            <Title>Delivery Order Price Calculator</Title>
          </div>
        </div>
      </div>

      <div className={styles.Container}>
        <DetailsForm formData={formData} setFormData={setFormData} />

        <Total
          data={{
            cart:
              cart.value && cart.value !== '.' && cart.value !== '' ? Number(cart.value) * 100 : 0,
            deliveryFee,
            smallOrderSurcharge
          }}
          distance={distance}
        />
      </div>
    </>
  )
}

export default App
