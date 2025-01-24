import { DetailsForm } from '../DetailsForm'
import { renderWithClient } from './setup'

describe('DetailsForm', () => {
  it('renders the DetailsForm with the correct structure', () => {
    const { getByText, getByRole } = renderWithClient(<DetailsForm />)

    expect(getByRole('heading', { name: /details/i })).toBeInTheDocument()
    expect(getByText(/enter venue slug/i)).toBeInTheDocument()
    expect(getByText(/enter cart value/i)).toBeInTheDocument()
    expect(getByText(/enter user latitude and longitude/i)).toBeInTheDocument()
    expect(getByRole('button', { name: /share location/i })).toBeInTheDocument()
  })
})
