import { useCallback, useState } from 'react'
import { VenueSlug } from '../App'

const VENUES_API = 'https://consumer-api.development.dev.woltapi.com/home-assignment-api/v1/venues' // TODO: add to .env

interface VenueStaticResponseType {
  venue_raw: {
    location: {
      coordinates: [number, number]
    }
  }
}

interface DistantRangeType {
  min: number // The lower (inclusive) bound for the distance range in meters
  max: number // The upper (exclusive) bound for the distance range in meters
  a: number // A constant amount to be added to the delivery fee on top of the base price
  b: number // Multiplier to be used for calculating distance based component of the delivery fee
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

interface VenueData {
  coordinates: [number, number]
  orderMinimumNoSurcharge: number
  basePrice: number
  distanceRanges: DistantRangeType[]
}

export const useVenueData = (addPoint: (coordinates: [number, number]) => void) => {
  const [data, setData] = useState<VenueData | null>(null)

  // TODO: you might want to use react query to cache static responses
  const fetchData = useCallback(
    (venueSlug: VenueSlug) => {
      Promise.all([
        fetch(`${VENUES_API}/${venueSlug}/static`).then(res => res.json()),
        fetch(`${VENUES_API}/${venueSlug}/dynamic`).then(res => res.json())
      ]).then(data => {
        const staticData = data[0] as VenueStaticResponseType
        const dynamicData = data[1] as VenueDynamicResponseType
        setData({
          coordinates: staticData.venue_raw.location.coordinates,
          orderMinimumNoSurcharge: dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge,
          basePrice: dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price,
          distanceRanges: dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges
        })

        addPoint(staticData.venue_raw.location.coordinates)
      })
    },
    [addPoint]
  )

  return { ...data, fetchData }
}
