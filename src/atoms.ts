import { atom } from 'jotai'
import { DistantRangeType } from './components/DetailsForm/VenueSlugInput/api'

type InputField = {
  value: string
  error?: string
}

export const slugAtom = atom<InputField>({ value: '' })
export const cartAtom = atom<InputField>({ value: '' })
export const userCoordinatesAtom = atom<InputField>({ value: '' })
export const distanceAtom = atom<number | null>(null)
export const venueDataAtom = atom<{
  orderMinimumNoSurcharge: number
  basePrice: number
  distanceRanges: DistantRangeType[]
} | null>(null)
export const venueCoordinatesAtom = atom<[number, number] | null>(null)
