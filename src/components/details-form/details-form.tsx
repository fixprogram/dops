import styles from './details-form.module.css'
import { GetLocationBtn } from '../get-location-btn/get-location-btn'
import { CartIcon } from '../ui/icons/cart-icon'
import { CityIcon } from '../ui/icons/city-icon'
import { LocationIcon } from '../ui/icons/location-icon'
import { Input } from '../ui/input/input'
import { ChangeEvent } from 'react'
import { useAtom } from 'jotai'
import { cartAtom, slugAtom, userCoordinatesAtom } from '../../atoms'
import { useVenueData } from '../../hooks/useVenueData'

export const DetailsForm = () => {
  useVenueData()
  const [{ value: slug }, setSlug] = useAtom(slugAtom)
  const [userCoords, setUserCoords] = useAtom(userCoordinatesAtom)
  const [{ value: cart }, setCart] = useAtom(cartAtom)

  const handleSlugChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSlug({ value: e.target.value, error: null })
  }

  const handleCartChange = (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9.]*$/ // Allow only numbers and "."
    if (!regex.test(e.target.value)) return

    setCart({ value: e.target.value, error: null })
  }

  const handleUserCoordsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const coordsRegex =
      /^(-?(?:[1-8]?\d(?:\.\d{1,7})?|90(?:\.0{1,7})?)),\s*(-?(?:1[0-7]\d(?:\.\d{1,7})?|[1-9]?\d(?:\.\d{1,7})?|180(?:\.0{1,7})?))$/

    // if doesn't match then error

    setUserCoords(e.target.value)
  }

  const setUserCoordinates = (coords: [number, number]) => {
    setUserCoords(coords.join(', '))
  }

  return (
    <section>
      <h3 className={styles.FormLegend}>Details</h3>

      <ul className={styles.FormList}>
        <li className={styles.FormItem}>
          <Input
            prefix={<CityIcon />}
            label="Enter venue slug"
            value={slug}
            onChange={handleSlugChange}
            // onChange={handleChange('slug')}
            required
          />
          <hr className={styles.FormSeparator} />
        </li>
        <li className={styles.FormItem}>
          <Input
            prefix={<CartIcon />}
            label="Enter cart value"
            value={cart ?? ''}
            onChange={handleCartChange}
            type="text"
            required
          />
          <hr className={styles.FormSeparator} />
        </li>
        <li className={styles.FormItem}>
          <Input
            label="Enter user longitude and latitude"
            prefix={<LocationIcon />}
            postfix={<GetLocationBtn onSuccess={setUserCoordinates} />}
            value={userCoords}
            onChange={handleUserCoordsChange}
            required
          />
        </li>
      </ul>
    </section>
  )
}
