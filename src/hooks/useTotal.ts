import { useAtom } from 'jotai'
import { useMemo } from 'react'
import { cartAtom, distanceAtom, venueDataAtom } from '../atoms'

export type Keys = 'cart' | 'deliveryFee' | 'smallOrderSurcharge'

export const useTotal = () => {
  const [{ value: cart }] = useAtom(cartAtom)
  const formattedCart = isNaN(Number(cart)) ? 0 : Number(cart) * 100

  const [distance] = useAtom(distanceAtom)
  const [venueData] = useAtom(venueDataAtom)

  const deliveryFee = useMemo(() => {
    if (distance && venueData) {
      const range = venueData.distanceRanges.find(
        ({ min, max }) => max !== 0 && distance >= min && distance < max
      )

      if (range) {
        return venueData.basePrice + range.a + (range.b * distance) / 10
      }
    }
  }, [venueData, distance])

  const deliveryError = useMemo(() => {
    if (distance && venueData) {
      const limit = venueData.distanceRanges.at(-1)!.min
      if (distance >= limit) {
        return `Delivery is not possible: ${distance} meters is beyond our limit of ${limit} meters.`
      }
    }
  }, [distance, venueData])

  const smallOrderSurcharge = useMemo(() => {
    if (venueData) {
      return venueData.orderMinimumNoSurcharge > formattedCart
        ? venueData.orderMinimumNoSurcharge - formattedCart
        : 0
    }
  }, [venueData, formattedCart])

  const formattedData = Object.entries({
    cart: formattedCart,
    deliveryFee,
    smallOrderSurcharge
  })
    .filter(([, value]) => typeof value === 'number')
    .map(item => ({ key: item[0] as Keys, value: item[1] as number }))

  const total = formattedData.reduce((acc, { value }) => acc + value, 0)

  return { formattedData, total, distance, deliveryError }
}
