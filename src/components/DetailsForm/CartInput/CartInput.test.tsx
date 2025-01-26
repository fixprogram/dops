import userEvent from '@testing-library/user-event'
import { act } from 'react'
import { DetailsForm } from '../DetailsForm'
import { renderWithClient } from '@/shared/utils/testUtils'

describe('Cart value input', () => {
  it('allows only numbers and "." in the cart value input', async () => {
    const user = userEvent.setup()
    const { getByTestId, findByText } = renderWithClient(<DetailsForm />)
    const cartInput = getByTestId('cartValue')

    await act(async () => {
      await user.type(cartInput, '10.50')
    })

    expect(cartInput).toHaveValue('10.50')

    await act(async () => {
      await user.type(cartInput, 'abc!@#')
    })

    await findByText(/Only numbers or "." are allowed/i)

    expect(cartInput).toHaveValue('10.50')
  })
})
