import { render } from '@testing-library/react'
import { FormField } from './FormField'
import { describe, expect, it } from 'vitest'

describe('FormField', () => {
  it('renders correctly with prefix, postfix, and error', () => {
    const { getByText, getByRole } = render(
      <FormField
        label="Test Label"
        prefix={<span>Prefix</span>}
        postfix={<span>Postfix</span>}
        error="Test Error"
        testId="testField"
      />
    )

    expect(getByText('Test Label')).toBeInTheDocument()
    expect(getByText('Prefix')).toBeInTheDocument()
    expect(getByText('Postfix')).toBeInTheDocument()
    expect(getByText('Test Error')).toBeInTheDocument()
    expect(getByRole('textbox')).toBeInTheDocument()
  })
})
