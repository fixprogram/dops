import styles from './DetailsForm.module.css'
import { FormField } from '../ui/FormField/FormField'
import { useVenueData } from '../../hooks/useVenueData'
import { useForm } from '../../hooks/useForm'

export const DetailsForm = () => {
  useVenueData()
  const filters = useForm()

  return (
    <section>
      <h3 className={styles.FormLegend}>Details</h3>

      <ul className={styles.FormList}>
        {filters.map(({ value, error, prefix, postfix, onChange, label }) => (
          <li className={styles.FormItem} key={label}>
            <FormField
              label={label}
              value={value}
              prefix={prefix}
              onChange={onChange}
              postfix={postfix}
              error={error}
              required
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
