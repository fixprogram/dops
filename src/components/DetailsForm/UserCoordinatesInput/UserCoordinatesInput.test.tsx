import { act } from 'react'

import userEvent from '@testing-library/user-event'
import { renderWithClient } from '@/shared/utils/testUtils'
import { DetailsForm } from '../DetailsForm'

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
