import { useEffect } from 'react'
import { slugAtom, venueCoordinatesAtom, venueDataAtom } from '../atoms'
import { useAtom } from 'jotai'
import { useDebounce } from './useDebounce'
import { useQuery } from '@tanstack/react-query'
import { fetchVenueData } from '../api'

export const useVenueData = () => {
  const [{ value: slug }, setSlug] = useAtom(slugAtom)
  const [, setVenueData] = useAtom(venueDataAtom)
  const [, setVenueCoordinates] = useAtom(venueCoordinatesAtom)

  const debouncedSlug = useDebounce(slug)

  const { data, isLoading, error } = useQuery({
    queryKey: ['venueData', debouncedSlug],
    queryFn: () => fetchVenueData(debouncedSlug),
    enabled: !!debouncedSlug,
    retry: false
  })

  useEffect(() => {
    if (data) {
      setVenueData({
        orderMinimumNoSurcharge: data.venueData.order_minimum_no_surcharge,
        basePrice: data.venueData.delivery_pricing.base_price,
        distanceRanges: data.venueData.delivery_pricing.distance_ranges
      })
      setVenueCoordinates(data.venueCoordinates)
    }
  }, [data, setVenueCoordinates, setVenueData])

  useEffect(() => {
    if (error) setSlug(prev => ({ ...prev, error: error.message }))
  }, [error, setSlug])

  useEffect(() => {
    if (slug.length === 0) {
      setVenueData(null)
      setVenueCoordinates(null)
    }
  }, [slug, setVenueData, setVenueCoordinates])

  return { isLoading }
}
