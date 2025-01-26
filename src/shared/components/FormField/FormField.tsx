import { FC, InputHTMLAttributes, ReactNode } from 'react'
import classNames from 'classnames'

import styles from './FormField.module.scss'
import { Text } from '../Text/Text'

interface FormFieldType<T> extends Omit<InputHTMLAttributes<T>, 'prefix' | 'postfix'> {
  label: string
  prefix?: ReactNode
  postfix?: ReactNode
  initialValue?: string
  error?: string
  testId?: string
}

export const FormField: FC<FormFieldType<unknown>> = ({
  label,
  prefix,
  postfix,
  type = 'text',
  placeholder = ' ',
  error,
  testId,
  id,
  ...rest
}) => {
  return (
    <div className={styles.Wrapper}>
      {prefix && <div className={styles.Prefix}>{prefix}</div>}

      <input
        data-test-id={testId}
        type={type}
        className={classNames(styles.Input, { [styles.InputError]: Boolean(error) })}
        placeholder={placeholder}
        id={id}
        {...rest}
      />

      <label className={styles.Label} htmlFor={id}>
        <Text as="span" weight="regular">
          {label}
        </Text>
      </label>

      {postfix && <div className={styles.Postfix}>{postfix}</div>}

      {error && (
        <Text color="error" type="body-2" className={styles.Error}>
          {error}
        </Text>
      )}
    </div>
  )
}
