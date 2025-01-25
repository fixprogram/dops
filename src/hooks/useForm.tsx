import { useAtom } from 'jotai'
import { slugAtom, userCoordinatesAtom, cartAtom } from '../atoms'
import { ChangeEvent, useMemo } from 'react'
import { Icon } from '../components/ui/Icon/Icon'
import { useShareLocation } from './useShareLocation'
import { Button } from '../components/ui/Button/Button'
import { Loader } from '../components/ui/Loader/Loader'
import { useVenueData } from './useVenueData'

export const useForm = () => {
  useVenueData()

  const [slug, setSlug] = useAtom(slugAtom)
  const [userCoordinates, setUserCoordinates] = useAtom(userCoordinatesAtom)
  const [cart, setCart] = useAtom(cartAtom)

  const { handleShareLocation, isLoading } = useShareLocation(coords =>
    setUserCoordinates({ value: coords.join(', ') })
  )

  return useMemo(
    () => [
      {
        key: 'slug',
        value: slug.value,
        error: slug.error,
        label: 'Enter venue slug',
        prefix: <Icon name="city" color="secondary" />,
        onChange: (e: ChangeEvent<HTMLInputElement>) => setSlug({ value: e.target.value })
      },
      {
        key: 'cart',
        value: cart.value,
        error: cart.error,
        label: 'Enter cart value',
        prefix: <Icon name="cart" color="secondary" />,
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          const regex = /^[0-9.]*$/
          if (!regex.test(e.target.value)) {
            return setCart({ value: cart.value, error: 'Only numbers or "." are allowed' })
          }
          setCart({ value: e.target.value })
        }
      },
      {
        key: 'userCoordinates',
        value: userCoordinates.value,
        error: userCoordinates.error,
        label: 'Enter user latitude and longitude',
        prefix: <Icon name="location" color="secondary" />,
        postfix: (
          <Button onClick={handleShareLocation} disabled={isLoading} ariaLabel="Share location">
            {isLoading ? <Loader /> : <Icon name="pin" />}
          </Button>
        ),
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          const regex = /^[0-9., ]*$/
          if (!regex.test(e.target.value)) {
            return setUserCoordinates({
              value: userCoordinates.value,
              error: 'Only numbers, "," or "." are allowed'
            })
          }
          setUserCoordinates({ value: e.target.value })
        }
      }
    ],
    [
      cart,
      slug,
      userCoordinates,
      setUserCoordinates,
      setCart,
      setSlug,
      handleShareLocation,
      isLoading
    ]
  )
}
