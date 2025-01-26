import { useEffect } from 'react'
import { useAtom } from 'jotai'
import { useQuery } from '@tanstack/react-query'

import { slugAtom, venueCoordinatesAtom, venueDataAtom } from '@/atoms'
import { useDebounce } from '@/shared/hooks/useDebounce'

import { fetchVenueCoordinates, fetchVenueDeliverySpecs } from './api'

export const useVenueData = () => {
  const [{ value: slug }, setSlug] = useAtom(slugAtom)
  const [, setVenueData] = useAtom(venueDataAtom)
  const [, setVenueCoordinates] = useAtom(venueCoordinatesAtom)

  const debouncedSlug = useDebounce(slug)

  const {
    data: coordinates,
    isLoading: isCoordinatesLoading,
    error: coordinatesError
  } = useQuery({
    queryKey: ['venueCoordinates', debouncedSlug],
    queryFn: () => fetchVenueCoordinates(debouncedSlug),
    enabled: !!debouncedSlug,
    retry: false,
    staleTime: Infinity
  })

  const {
    data: deliverySpecs,
    isLoading: isDeliverySpecsLoading,
    error: deliverySpecsError
  } = useQuery({
    queryKey: ['deliverySpecs', debouncedSlug],
    queryFn: () => fetchVenueDeliverySpecs(debouncedSlug),
    enabled: !!debouncedSlug,
    retry: false
  })

  useEffect(() => {
    if (coordinates) {
      setVenueCoordinates(coordinates)
    }
  }, [coordinates, setVenueCoordinates])

  useEffect(() => {
    if (deliverySpecs) {
      setVenueData({
        orderMinimumNoSurcharge: deliverySpecs.order_minimum_no_surcharge,
        basePrice: deliverySpecs.delivery_pricing.base_price,
        distanceRanges: deliverySpecs.delivery_pricing.distance_ranges
      })
    }
  }, [deliverySpecs, setVenueData])

  useEffect(() => {
    const error = coordinatesError || deliverySpecsError
    if (error) {
      setSlug(prev => ({ ...prev, error: error.message }))

      setVenueData(null)
      setVenueCoordinates(null)
    }
  }, [coordinatesError, deliverySpecsError, setSlug, setVenueData, setVenueCoordinates])

  useEffect(() => {
    if (slug.length === 0) {
      setVenueData(null)
      setVenueCoordinates(null)
    }
  }, [slug, setVenueData, setVenueCoordinates])

  return { isLoading: isCoordinatesLoading || isDeliverySpecsLoading }
}
