import { FormField } from '../ui/FormField/FormField'
import { useForm } from '../../hooks/useForm'
import { Text } from '../ui/Text/Text'

import styles from './DetailsForm.module.scss'

export const DetailsForm = () => {
  const filters = useForm()

  return (
    <section>
      <Text as="h2" type="subtitle">
        Details
      </Text>

      <ul className={styles.FormList}>
        {filters.map(({ key, value, error, prefix, postfix, onChange, label }) => (
          <li key={key} data-test-id={`${key}Value`}>
            <FormField
              testId={`${key}Value`}
              label={label}
              value={value}
              prefix={prefix}
              onChange={onChange}
              postfix={postfix}
              error={error}
              required
            />
            <hr className={styles.FormSeparator} />
          </li>
        ))}
      </ul>
    </section>
  )
}
