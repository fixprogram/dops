import { ButtonHTMLAttributes, FC } from 'react'
import classNames from 'classnames'

import styles from './Button.module.css'

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
    className={classNames(styles.Button, { [styles.Disabled]: disabled })}
    onClick={onClick}
    aria-label={ariaLabel}
    disabled={disabled}
  >
    {children}
  </button>
)
