import { FC, InputHTMLAttributes, ReactNode } from 'react'
import cn from 'classnames'
import styles from './FormField.module.css'

interface FormFieldType<T> extends InputHTMLAttributes<T> {
  label: string
  prefix?: ReactNode
  postfix?: ReactNode
  initialValue?: string
  error?: string
}

export const FormField: FC<FormFieldType<unknown>> = ({
  label,
  prefix,
  postfix,
  type = 'text',
  error,
  ...rest
}) => {
  return (
    <>
      <div className={styles.Wrapper}>
        {prefix && <div className={styles.Prefix}>{prefix}</div>}

        <input
          type={type}
          className={cn(styles.Input, error ? styles.InputError : null)}
          placeholder=" "
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
