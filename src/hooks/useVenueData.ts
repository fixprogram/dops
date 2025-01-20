import { useCallback, useEffect } from 'react'
import { DistantRangeType, slugAtom, venueCoordinatesAtom, venueDataAtom } from '../atoms'
import { useAtom } from 'jotai'
import { useDebounce } from './useDebounce'

interface VenueStaticResponseType {
  venue_raw: {
    location: {
      coordinates: [number, number]
    }
  }
}

interface VenueDynamicResponseType {
  venue_raw: {
    delivery_specs: {
      order_minimum_no_surcharge: number
      delivery_pricing: {
        base_price: number
        distance_ranges: DistantRangeType[]
      }
    }
  }
}

export const useVenueData = () => {
  const [{ value: slug }, setSlug] = useAtom(slugAtom)
  const [, setVenueData] = useAtom(venueDataAtom)
  const [, setVenueCoordinates] = useAtom(venueCoordinatesAtom)

  const delayedSlug = useDebounce(slug)

  // TODO: you might want to use react query to cache static responses
  const fetchData = useCallback(
    (venueSlug: string) => {
      try {
        Promise.all([
          fetch(`${import.meta.env.VITE_VENUES_API}/${venueSlug}/static`).then(res => res.json()),
          fetch(`${import.meta.env.VITE_VENUES_API}/${venueSlug}/dynamic`).then(res => res.json())
        ]).then(data => {
          const staticData = data[0] as VenueStaticResponseType

          if (data[0].message) {
            return setSlug({ value: venueSlug, error: data[0].message })
          }

          const dynamicData = data[1] as VenueDynamicResponseType
          setVenueData({
            coordinates: staticData.venue_raw.location.coordinates,
            orderMinimumNoSurcharge:
              dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge,
            basePrice: dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price,
            distanceRanges: dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges
          })

          setVenueCoordinates(staticData.venue_raw.location.coordinates)
          // addVenue(staticData.venue_raw.location.coordinates)
        })
      } catch (e) {
        setSlug({ value: venueSlug, error: 'Cannot find a venue with this slug' })
      }
    },
    [setVenueCoordinates, setVenueData, setSlug]
  )

  useEffect(() => {
    if (slug.length === 0) {
      setVenueData(null)
      setVenueCoordinates(null)
    }
  }, [slug, setVenueData, setVenueCoordinates])

  useEffect(() => {
    if (delayedSlug.length) {
      fetchData(delayedSlug)
    }
  }, [fetchData, delayedSlug])
}
