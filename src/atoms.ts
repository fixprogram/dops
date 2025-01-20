import { atom } from 'jotai'

export interface DistantRangeType {
  min: number // The lower (inclusive) bound for the distance range in meters
  max: number // The upper (exclusive) bound for the distance range in meters
  a: number // A constant amount to be added to the delivery fee on top of the base price
  b: number // Multiplier to be used for calculating distance based component of the delivery fee
}

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
