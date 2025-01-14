import { Button } from '../ui/button/button'
import styles from './details-form.module.css'
import { GetLocationBtn } from '../get-location-btn/get-location-btn'
import { CartIcon } from '../ui/icons/cart-icon'
import { CityIcon } from '../ui/icons/city-icon'
import { LocationIcon } from '../ui/icons/location-icon'
import { Input } from '../ui/input/input'
import { ChangeEvent, FormEvent, useState } from 'react'

// interface FormData {

// }

export const DetailsForm = ({ formData, setFormData }) => {
  //   const [formData, setFormData] = useState({
  //     slug: {
  //       value: '',
  //       error: null
  //     },
  //     cart: {
  //       value: 0,
  //       error: null
  //     },
  //     userCoordinates: {
  //       value: '',
  //       error: null
  //     }
  //   })

  const validateForm = () => {
    const errors = {}
    // if (!formData.slug) errors.slug = "Venue slug is required.";
    if (!formData.cart || formData.cart.value < 0)
      errors.cart = 'Cart value must be a valid number.'
    // if (!formData.userCoordinates)
    //   errors.userCoordinates = "Coordinates are required.";

    setFormData(prev => ({ ...prev, errors }))
    return Object.keys(errors).length === 0
  }

  const handleChange = (field: keyof typeof formData) => (e: ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: { ...prev[field], value: field === 'cart' ? Number(e.target.value) : e.target.value }
    }))
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return

    console.log('Form submitted:', {
      slug: formData.slug,
      cart: formData.cart,
      userCoordinates: formData.userCoordinates
    })
    // Add further logic here
  }

  //   const setUserCoordinates = (coordinates: string) => {
  //     setFormData((prev) => ({
  //       ...prev,
  //       userCoordinates: {},
  //     }));
  //   };

  return (
    <section>
      <h3 className={styles.FormLegend}>Details</h3>

      <form onSubmit={handleSubmit}>
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
              value={formData.cart.value}
              onChange={handleChange('cart')}
              required
            />
            <hr className={styles.FormSeparator} />
          </li>
          <li className={styles.FormItem}>
            <Input
              label="Enter user longitude and latitude"
              prefix={<LocationIcon />}
              postfix={<GetLocationBtn onSuccess={handleChange('userCoordinates')} />}
              value={formData.userCoordinates.value}
              onChange={handleChange('userCoordinates')}
              required
            />
          </li>
        </ul>
        <Button>Calculate total</Button>
      </form>
    </section>
  )
}
