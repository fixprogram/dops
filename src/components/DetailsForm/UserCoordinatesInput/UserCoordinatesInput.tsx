import { useCallback, ChangeEvent } from 'react'
import { useAtom } from 'jotai'

import { userCoordinatesAtom } from '@/atoms'
import { FormField } from '@/shared/components/FormField'
import { Icon } from '@/shared/components/Icon'

import { ShareLocationButton } from '../ShareLocationButton'

export const UserCoordinatesInput = () => {
  const [{ value, error }, setUserCoordinates] = useAtom(userCoordinatesAtom)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const regex = /^[0-9., ]*$/
      if (!regex.test(e.target.value)) {
        return setUserCoordinates(prev => ({
          ...prev,
          error: 'Only numbers, "," or "." are allowed'
        }))
      }
      setUserCoordinates({ value: e.target.value })
    },
    [setUserCoordinates]
  )

  return (
    <FormField
      label="Enter user latitude and longitude"
      value={value}
      error={error}
      prefix={<Icon name="cart" color="secondary" />}
      postfix={<ShareLocationButton />}
      onChange={handleChange}
      testId="userCoordinatesValue"
    />
  )
}
