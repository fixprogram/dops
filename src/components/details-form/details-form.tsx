import styles from './details-form.module.css'
import { GetLocationBtn } from '../get-location-btn/get-location-btn'
import { CartIcon } from '../ui/icons/cart-icon'
import { CityIcon } from '../ui/icons/city-icon'
import { LocationIcon } from '../ui/icons/location-icon'
import { Input } from '../ui/input/input'
import { ChangeEvent } from 'react'

export const DetailsForm = ({ formData, setFormData }) => {
  const handleChange = (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
    const regex = /^[0-9.]*$/ // Allow only numbers and "."
    if (field === 'cart' && !regex.test(e.target.value)) return

    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], value: e.target.value }
    }))
  }

  const setUserCoordinates = (coords: [number, number]) => {
    setFormData(prev => ({
      ...prev,
      userCoordinates: {
        ...prev.userCoordinates,
        value: coords.join(', ')
      }
    }))
  }

  return (
    <section>
      <h3 className={styles.FormLegend}>Details</h3>

      <ul className={styles.FormList}>
        <li className={styles.FormItem}>
          <Input
            prefix={<CityIcon />}
            label="Enter venue slug"
            value={formData.slug.value}
            onChange={handleChange('slug')}
            required
          />
          <hr className={styles.FormSeparator} />
        </li>
        <li className={styles.FormItem}>
          <Input
            prefix={<CartIcon />}
            label="Enter cart value"
            value={formData.cart.value ?? ''}
            onChange={handleChange('cart')}
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
            value={formData.userCoordinates.value}
            onChange={handleChange('userCoordinates')}
            required
          />
        </li>
      </ul>
    </section>
  )
}
