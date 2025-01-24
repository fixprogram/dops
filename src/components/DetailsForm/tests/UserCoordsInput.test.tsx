import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { DetailsForm } from '../DetailsForm'
import { renderWithClient } from './setup'
import { waitFor } from '@testing-library/dom'
import { renderHook } from '@testing-library/react'
import { useAtom } from 'jotai'
import { userCoordinatesAtom } from '../../../atoms'

describe('User coordinates input', () => {
  it('allows only numbers, ".", and "," in the user coordinates input', async () => {
    const user = userEvent.setup()
    const { getByTestId, findByText } = renderWithClient(<DetailsForm />)
    const coordinatesInput = getByTestId('userCoordinatesValue')

    await act(async () => {
      await user.type(coordinatesInput, '60.17094,24.93087')
    })

    expect(coordinatesInput).toHaveValue('60.17094,24.93087')

    await act(async () => {
      await user.type(coordinatesInput, 'abc!@#')
    })

    await findByText(/Only numbers, "," or "." are allowed/i)

    expect(coordinatesInput).toHaveValue('60.17094,24.93087')
  })
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
