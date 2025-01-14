import { useCallback, useMemo, useState } from 'react'
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
      value: 0,
      error: null
    },
    userCoordinates: {
      value: '',
      error: null
    }
  })
  const { slug, cart, userCoordinates } = formData

  const { mapContainerRef, addPoint, distance } = useMap()
  const { orderMinimumNoSurcharge, basePrice, distanceRanges, fetchData } = useVenueData(addPoint)

  const getLocation = useCallback(() => {
    fetchData(slug)

    const coords = userCoordinates.trim().split(', ').map(Number) as [number, number]

    addPoint(coords)
  }, [userCoordinates, addPoint, slug, fetchData])

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
      return orderMinimumNoSurcharge > Number(cart) * 100
        ? orderMinimumNoSurcharge - Number(cart) * 100
        : 0
    }
  }, [orderMinimumNoSurcharge, cart])

  const total = useMemo(() => {
    if (cart.value && cart.value > 0) {
      if (deliveryFee && smallOrderSurcharge) {
        return cart.value * 100 + deliveryFee + smallOrderSurcharge
      }

      return cart.value
    }
  }, [deliveryFee, smallOrderSurcharge, cart.value])

  return (
    <>
      <div className={styles.MapWrapper}>
        <div id="map-container" className={styles.Map} />
        {/* <div id="map-container" className={styles.Map} ref={mapContainerRef} /> */}

        <div className={styles.Hero}>
          <div className={styles.HeroInner}>
            {/* TODO: change to the full title */}
            <Title>DOPC</Title>
          </div>
        </div>
      </div>

      <div className={styles.Container}>
        <DetailsForm formData={formData} setFormData={setFormData} />

        <Total
          cart={cart.value}
          deliveryFee={deliveryFee}
          distance={distance}
          smallOrderSurcharge={smallOrderSurcharge}
          total={total}
        />
      </div>
    </>
  )
}

export default App
