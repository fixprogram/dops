import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useAtom } from 'jotai'
import { act } from 'react'

import { userCoordinatesAtom } from '@/atoms'
import { renderWithClient } from '@/shared/utils/testUtils'

import { DetailsForm } from '../DetailsForm'

Object.defineProperty(navigator, 'geolocation', {
  value: {
    getCurrentPosition: vi.fn()
  },
  writable: true
})

describe('Location sharing button', () => {
  it('updates user coordinates when location is shared', async () => {
    const mockCoordinates = { latitude: 60.17094, longitude: 24.93087 }
    vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation(success =>
      success({
        coords: mockCoordinates,
        timestamp: Date.now()
      } as GeolocationPosition)
    )

    const user = userEvent.setup()
    const { getByRole } = renderWithClient(<DetailsForm />)
    const shareLocationButton = getByRole('button', { name: /share location/i })

    await act(async () => {
      await user.click(shareLocationButton)
    })

    const {
      result: { current: userCoordinates }
    } = renderHook(() => useAtom(userCoordinatesAtom))

    expect(userCoordinates[0].value).toBe(
      `${mockCoordinates.latitude}, ${mockCoordinates.longitude}`
    )
  })

  it('shows a loading spinner when location is being fetched', async () => {
    vi.spyOn(navigator.geolocation, 'getCurrentPosition').mockImplementation(() => {
      // Simulate a delay in fetching location
      setTimeout(() => {}, 1000)
    })

    const user = userEvent.setup()
    const { getByRole, findByTestId } = renderWithClient(<DetailsForm />)
    const shareLocationButton = getByRole('button', { name: /share location/i })

    await act(async () => {
      await user.click(shareLocationButton)
    })

    await waitFor(async () => {
      expect(await findByTestId('loading-spinner')).toBeInTheDocument()
    })
  })
})
