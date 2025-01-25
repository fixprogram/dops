import { ButtonHTMLAttributes, FC } from 'react'

import styles from './Button.module.scss'

interface ButtonPropsType<T> extends ButtonHTMLAttributes<T> {
  ariaLabel: string
}

export const Button: FC<ButtonPropsType<unknown>> = ({
  type = 'button',
  onClick,
  disabled,
  ariaLabel,
  children
}) => (
  <button
    type={type}
    className={styles.Button}
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
  >
    {children}
  </button>
)
