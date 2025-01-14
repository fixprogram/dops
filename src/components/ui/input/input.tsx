import { FC, InputHTMLAttributes, ReactNode } from 'react'
import styles from './input.module.css'

interface InputType<T> extends InputHTMLAttributes<T> {
  label: string
  prefix?: ReactNode
  postfix?: ReactNode
}

export const Input: FC<InputType<unknown>> = ({
  label,
  prefix,
  postfix,
  type = 'text',
  ...rest
}) => {
  return (
    <div className={styles.Wrapper}>
      {prefix && <div className={styles.Prefix}>{prefix}</div>}

      <input type={type} className={styles.Input} placeholder=" " {...rest} />
      <label className={styles.Label}>{label}</label>

      {postfix && <div className={styles.Postfix}>{postfix}</div>}
    </div>
  )
}
