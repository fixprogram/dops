export interface DistantRangeType {
  min: number // The lower (inclusive) bound for the distance range in meters
  max: number // The upper (exclusive) bound for the distance range in meters
  a: number // A constant amount to be added to the delivery fee on top of the base price
  b: number // Multiplier to be used for calculating distance based component of the delivery fee
}

export interface VenueStaticResponseType {
  venue_raw: {
    location: {
      coordinates: [number, number]
    }
  }
}

export interface VenueDynamicResponseType {
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

export const fetchVenueCoordinates = async (venueSlug: string) => {
  const staticRes = await fetch(`${import.meta.env.VITE_VENUES_API}/${venueSlug}/static`)

  if (!staticRes.ok) {
    const errorData = await staticRes.json()
    throw new Error(errorData.message || `Static data fetch failed with status ${staticRes.status}`)
  }

  const staticData: VenueStaticResponseType = await staticRes.json()
  return staticData.venue_raw.location.coordinates
}

export const fetchVenueDeliverySpecs = async (venueSlug: string) => {
  const dynamicRes = await fetch(`${import.meta.env.VITE_VENUES_API}/${venueSlug}/dynamic`)

  if (!dynamicRes.ok) {
    const errorData = await dynamicRes.json()
    throw new Error(
      errorData.message || `Dynamic data fetch failed with status ${dynamicRes.status}`
    )
  }

  const dynamicData: VenueDynamicResponseType = await dynamicRes.json()

  return dynamicData.venue_raw.delivery_specs
}
