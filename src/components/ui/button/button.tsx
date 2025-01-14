import { ButtonHTMLAttributes, FC } from 'react'

import styles from './button.module.css'

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...rest }) => {
  return (
    <button {...rest} className={styles.Button}>
      {children}
    </button>
  )
}
