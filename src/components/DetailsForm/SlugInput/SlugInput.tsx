import { useAtom } from 'jotai'
import { ChangeEvent, useCallback } from 'react'

import { slugAtom } from '@/atoms'
import { FormField } from '@/shared/components/FormField'
import { Icon } from '@/shared/components/Icon'
import { Loader } from '@/shared/components/Loader'

import { useVenueData } from './SlugInput.hook'

export const SlugInput = () => {
  const { isLoading } = useVenueData()
  const [{ value, error }, setSlug] = useAtom(slugAtom)

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => setSlug({ value: e.target.value }),
    [setSlug]
  )

  return (
    <FormField
      label="Enter venue slug"
      value={value}
      error={error}
      prefix={<Icon name="city" color="secondary" />}
      postfix={isLoading ? <Loader /> : null}
      onChange={handleChange}
      testId="slugValue"
    />
  )
}
