import { ElementType, FC, ReactNode } from 'react'
import classNames from 'classnames'

import styles from './Text.module.scss'

interface TextPropsType {
  as?: 'h1' | 'h2' | 'p' | 'dt' | 'dd' | 'b'
  type?: 'title' | 'subtitle' | 'body-1' | 'body-2'
  color?: 'primary' | 'secondary' | 'error'
  children: ReactNode
  className?: string
}

export const Text: FC<TextPropsType> = ({
  as = 'p',
  type = 'body-1',
  color = 'secondary',
  children,
  className,
  ...rest
}) => {
  const typeClass = styles[`Text--${type}`]
  const colorClass = styles[`Text--${color}`]

  const Element = as as ElementType

  return (
    <Element className={classNames(styles.Text, typeClass, colorClass, className)} {...rest}>
      {children}
    </Element>
  )
}
