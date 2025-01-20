import { act, render, renderHook } from '@testing-library/react'
import { describe, expect, vi, it, beforeAll, afterEach, afterAll } from 'vitest'
import { userEvent } from '@testing-library/user-event'
import { DetailsForm } from './DetailsForm'
import { useAtom } from 'jotai'
import { http, HttpResponse } from 'msw'
import { setupServer } from 'msw/node'
import { slugAtom, venueCoordinatesAtom, venueDataAtom } from '../../atoms'

vi.mock('./useDebounce', () => ({ useDebounce: (value: string) => value }))

const server = setupServer()

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()

  const { result } = renderHook(() => useAtom(slugAtom))
  act(() => result.current[1]({ value: '' }))
})
afterAll(() => server.close())

const mockStaticResponse = { venue_raw: { location: { coordinates: [10, 20] } } }
const mockDynamicResponse = {
  venue_raw: {
    delivery_specs: {
      order_minimum_no_surcharge: 10,
      delivery_pricing: { base_price: 5, distance_ranges: [{ min_distance: 0, price_per_km: 1 }] }
    }
  }
}

describe('DetailsForm', () => {
  it('renders the DetailsForm with the correct structure', () => {
    const { getByText, getByRole } = render(<DetailsForm />)

    expect(getByRole('heading', { name: /details/i })).toBeInTheDocument()
    expect(getByText(/enter venue slug/i)).toBeInTheDocument()
    expect(getByText(/enter cart value/i)).toBeInTheDocument()
    expect(getByText(/enter user longitude and latitude/i)).toBeInTheDocument()
  })

  describe('Venue slug input', () => {
    it('sends request after a delay venue slug', async () => {
      const input = 'test_slug'
      const user = userEvent.setup()

      const { getByTestId } = render(<DetailsForm />)

      const venueSlugInput = getByTestId('slugValue')
      await act(async () => await user.type(venueSlugInput, input))

      expect(venueSlugInput).toHaveValue(input)
    })

    it('fetches data correctly when slug changes', async () => {
      const input = 'test_slug'
      server.use(
        http.get(`${import.meta.env.VITE_VENUES_API}/${input}/static`, () => {
          return HttpResponse.json(mockStaticResponse)
        }),
        http.get(`${import.meta.env.VITE_VENUES_API}/${input}/dynamic`, () => {
          return HttpResponse.json(mockDynamicResponse)
        })
      )

      const user = userEvent.setup()
      const { getByTestId } = render(<DetailsForm />)
      const venueSlugInput = getByTestId('slugValue')

      await act(async () => {
        await user.type(venueSlugInput, input)
        await new Promise(resolve => setTimeout(resolve, 1000))
      })

      const {
        result: { current: venueData }
      } = renderHook(() => useAtom(venueDataAtom))
      const {
        result: { current: venueCoordinates }
      } = renderHook(() => useAtom(venueCoordinatesAtom))

      expect(venueData[0]).toEqual({
        orderMinimumNoSurcharge: 10,
        basePrice: 5,
        distanceRanges: [{ min_distance: 0, price_per_km: 1 }]
      })
      expect(venueCoordinates[0]).toEqual([10, 20])
    })

    it('sets error when static request fails', async () => {
      const input = 'test_slug'

      server.use(
        http.get(`${import.meta.env.VITE_VENUES_API}/${input}/static`, () => {
          return HttpResponse.json({ message: 'Not found' })
        }),
        http.get(`${import.meta.env.VITE_VENUES_API}/${input}/dynamic`, () => {
          return HttpResponse.json({})
        })
      )

      const user = userEvent.setup()

      const { getByTestId, findByText } = render(<DetailsForm />)
      const venueSlugInput = getByTestId('slugValue')

      await act(async () => {
        await user.type(venueSlugInput, input)
      })

      await findByText(/Not Found/i)

      const {
        result: { current }
      } = renderHook(() => useAtom(slugAtom))

      expect(current[0].error).toBe('Not found')
    })

    it('sets error when dynamic request fails', async () => {
      const input = 'test_slug'

      server.use(
        http.get(`${import.meta.env.VITE_VENUES_API}/${input}/static`, () => {
          return HttpResponse.json({ venue_raw: { location: { coordinates: [10, 20] } } })
        }),
        http.get(`${import.meta.env.VITE_VENUES_API}/${input}/dynamic`, () => {
          return HttpResponse.json({ message: `No venue with slug of '${input}' was found` })
        })
      )

      const user = userEvent.setup()
      const { getByTestId, findByText } = render(<DetailsForm />)
      const venueSlugInput = getByTestId('slugValue')

      await act(async () => {
        await user.type(venueSlugInput, input)
      })
      await findByText(/No venue with slug of 'test_slug' was found/i)

      const {
        result: { current }
      } = renderHook(() => useAtom(slugAtom))

      expect(current[0].error).toBe(`No venue with slug of '${input}' was found`)
    })

    it('clears venue data and coordinates when slug is empty', async () => {
      const input = 'test_slug'

      server.use(
        http.get(`${import.meta.env.VITE_VENUES_API}/${input}/static`, () => {
          return HttpResponse.json(mockStaticResponse)
        }),
        http.get(`${import.meta.env.VITE_VENUES_API}/${input}/dynamic`, () => {
          return HttpResponse.json(mockDynamicResponse)
        })
      )

      const user = userEvent.setup()

      const { getByTestId } = render(<DetailsForm />)

      const venueSlugInput = getByTestId('slugValue')

      await act(async () => {
        await user.type(venueSlugInput, input)
        await new Promise(resolve => setTimeout(resolve, 1000))
      })

      const {
        result: { current: venueCoordinates }
      } = renderHook(() => useAtom(venueCoordinatesAtom))

      expect(venueCoordinates).toContainEqual([10, 20])

      await act(async () => {
        await user.clear(venueSlugInput)
        await new Promise(resolve => setTimeout(resolve, 1000))
      })

      const {
        result: { current }
      } = renderHook(() => useAtom(venueDataAtom))

      expect(current[0]).toBeNull()
    })
  })
})
