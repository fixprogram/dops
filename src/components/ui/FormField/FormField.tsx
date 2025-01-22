import { FC, InputHTMLAttributes, ReactNode } from 'react'
import cn from 'classnames'
import styles from './FormField.module.css'

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
  ...rest
}) => {
  return (
    <>
      <div className={styles.Wrapper}>
        {prefix && <div className={styles.Prefix}>{prefix}</div>}

        <input
          data-testid={testId}
          type={type}
          className={cn(styles.Input, error ? styles.InputError : null)}
          placeholder={placeholder}
          {...rest}
        />
        <label className={styles.Label}>{label}</label>

        {postfix && <div className={styles.Postfix}>{postfix}</div>}
      </div>

      {error && (
        <>
          <hr className={styles.FormSeparator} />
          <p className={styles.Error}>{error}</p>
        </>
      )}
    </>
  )
}
