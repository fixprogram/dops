import { useAtom } from 'jotai'
import { slugAtom, userCoordinatesAtom, cartAtom } from '../atoms'
import { ChangeEvent, useMemo } from 'react'
import { CityIcon } from '../components/ui/icons/city-icon'
import { ShareLocationButton } from '../components/ShareLocationButton/ShareLocationButton'
import { CartIcon } from '../components/ui/icons/cart-icon'
import { LocationIcon } from '../components/ui/icons/location-icon'

export const useForm = () => {
  const [slug, setSlug] = useAtom(slugAtom)
  const [userCoordinates, setUserCoordinates] = useAtom(userCoordinatesAtom)
  const [cart, setCart] = useAtom(cartAtom)

  return useMemo(
    () => [
      {
        key: 'slug',
        value: slug.value,
        error: slug.error,
        label: 'Enter venue slug',
        prefix: <CityIcon />,
        onChange: (e: ChangeEvent<HTMLInputElement>) => setSlug({ value: e.target.value })
      },
      {
        key: 'cart',
        value: cart.value,
        error: cart.error,
        label: 'Enter cart value',
        prefix: <CartIcon />,
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
        label: 'Enter user longitude and latitude',
        prefix: <LocationIcon />,
        postfix: (
          <ShareLocationButton
            onSuccess={coords => setUserCoordinates({ value: coords.join(', ') })}
          />
        ),
        onChange: (e: ChangeEvent<HTMLInputElement>) => {
          const regex = /^[0-9., ]*$/
          if (!regex.test(e.target.value)) {
            return setUserCoordinates({
              value: userCoordinates.value,
              error: 'Only numbers or "." are allowed'
            })
          }
          setUserCoordinates({ value: e.target.value })
        }
      }
    ],
    [cart, slug, userCoordinates, setUserCoordinates, setCart, setSlug]
  )
}
