import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAtom } from 'jotai'
import { http, HttpResponse } from 'msw'
import { act } from 'react'
import { venueDataAtom, venueCoordinatesAtom, slugAtom } from '../../../atoms'
import { DetailsForm } from '../DetailsForm'
import { renderWithClient, server } from './setup'
import { VenueDynamicResponseType, VenueStaticResponseType } from '../../../api'

const mockStaticResponse: VenueStaticResponseType = {
  venue_raw: { location: { coordinates: [10, 20] } }
}
const mockDynamicResponse: VenueDynamicResponseType = {
  venue_raw: {
    delivery_specs: {
      order_minimum_no_surcharge: 10,
      delivery_pricing: { base_price: 5, distance_ranges: [{ min: 0, max: 1000, a: 0, b: 0 }] }
    }
  }
}

describe('Venue slug input', () => {
  it('sends request after a delay venue slug', async () => {
    const input = 'test_slug'
    const user = userEvent.setup()

    const { getByTestId } = renderWithClient(<DetailsForm />)

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
    const { getByTestId } = renderWithClient(<DetailsForm />)
    const venueSlugInput = getByTestId('slugValue')

    await act(async () => {
      await user.type(venueSlugInput, input)
    })

    await waitFor(async () => {
      const {
        result: { current: venueData }
      } = renderHook(() => useAtom(venueDataAtom))
      const {
        result: { current: venueCoordinates }
      } = renderHook(() => useAtom(venueCoordinatesAtom))

      expect(venueData[0]).toEqual({
        orderMinimumNoSurcharge: 10,
        basePrice: 5,
        distanceRanges: [{ min: 0, max: 1000, a: 0, b: 0 }]
      })
      expect(venueCoordinates[0]).toEqual([10, 20])
    })
  })

  it('sets error when static request fails', async () => {
    const input = 'test_slug'

    server.use(
      http.get(`${import.meta.env.VITE_VENUES_API}/${input}/static`, () => {
        return HttpResponse.json({ message: 'Not found' }, { status: 404 })
      }),
      http.get(`${import.meta.env.VITE_VENUES_API}/${input}/dynamic`, () => {
        return HttpResponse.json({})
      })
    )

    const user = userEvent.setup()

    const { getByTestId, findByText } = renderWithClient(<DetailsForm />)
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
        return HttpResponse.json(
          { message: `No venue with slug of '${input}' was found` },
          { status: 404 }
        )
      })
    )

    const user = userEvent.setup()
    const { getByTestId, findByText } = renderWithClient(<DetailsForm />)
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

    const { getByTestId } = renderWithClient(<DetailsForm />)

    const venueSlugInput = getByTestId('slugValue')

    await act(async () => {
      await user.type(venueSlugInput, input)
    })

    await waitFor(async () => {
      const {
        result: { current: venueCoordinates }
      } = renderHook(() => useAtom(venueCoordinatesAtom))

      expect(venueCoordinates).toContainEqual([10, 20])
    })

    await act(async () => {
      await user.clear(venueSlugInput)
    })

    await waitFor(async () => {
      const {
        result: { current }
      } = renderHook(() => useAtom(venueDataAtom))

      expect(current[0]).toBeNull()
    })
  })
})
