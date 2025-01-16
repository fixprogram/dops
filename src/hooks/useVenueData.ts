import { useCallback, useEffect } from 'react'
import { DistantRangeType, slugAtom, venueCoordinatesAtom, venueDataAtom } from '../atoms'
import { useAtom } from 'jotai'

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

// interface VenueData {
//   // coordinates: [number, number]
//   orderMinimumNoSurcharge: number
//   basePrice: number
//   distanceRanges: DistantRangeType[]
// }

export const useVenueData = () =>
  // slug: string,
  // addVenue: (coordinates: [number, number]) => void,
  // removeVenue: () => void
  {
    // export const useVenueData = (addPoint: (coordinates: [number, number]) => void) => {
    const [{ value: slug }] = useAtom(slugAtom)
    const [, setVenueData] = useAtom(venueDataAtom)
    const [, setVenueCoordinates] = useAtom(venueCoordinatesAtom)
    // const [data, setData] = useState<VenueData | null>(null)

    // TODO: you might want to use react query to cache static responses
    const fetchData = useCallback(
      (venueSlug: string) => {
        Promise.all([
          fetch(`${import.meta.env.VITE_VENUES_API}/${venueSlug}/static`).then(res => res.json()),
          fetch(`${import.meta.env.VITE_VENUES_API}/${venueSlug}/dynamic`).then(res => res.json())
        ]).then(data => {
          const staticData = data[0] as VenueStaticResponseType
          const dynamicData = data[1] as VenueDynamicResponseType
          setVenueData({
            // coordinates: staticData.venue_raw.location.coordinates,
            orderMinimumNoSurcharge:
              dynamicData.venue_raw.delivery_specs.order_minimum_no_surcharge,
            basePrice: dynamicData.venue_raw.delivery_specs.delivery_pricing.base_price,
            distanceRanges: dynamicData.venue_raw.delivery_specs.delivery_pricing.distance_ranges
          })

          setVenueCoordinates(staticData.venue_raw.location.coordinates)
          // addVenue(staticData.venue_raw.location.coordinates)
        })
      },
      [setVenueCoordinates, setVenueData]
    )

    useEffect(() => {
      if (slug.length === 0) {
        setVenueData(null)
        setVenueCoordinates(null)
      } else {
        fetchData(slug)
      }
    }, [slug, fetchData, setVenueData, setVenueCoordinates])
  }
