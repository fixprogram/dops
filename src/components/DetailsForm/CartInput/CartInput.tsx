import { useAtom } from 'jotai'
import { ChangeEvent, useCallback } from 'react'

import { cartAtom } from '@/atoms'
import { FormField } from '@/shared/components/FormField'
import { Icon } from '@/shared/components/Icon'

export const CartInput = () => {
  const [{ value, error }, setCart] = useAtom(cartAtom)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^[0-9.]*$/
      if (!regex.test(e.target.value)) {
        return setCart(prev => ({ ...prev, error: 'Only numbers or "." are allowed' }))
      }
      setCart({ value: e.target.value })
    },
    [setCart]
  )

  return (
    <FormField
      label="Enter cart value"
      value={value}
      error={error}
      prefix={<Icon name="cart" color="secondary" />}
      onChange={handleChange}
      testId="cartValue"
    />
  )
}
