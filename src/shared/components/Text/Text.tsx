import { ElementType, FC, ReactNode } from 'react'
import classNames from 'classnames'

import styles from './Text.module.scss'

interface TextPropsType {
  children: ReactNode
  as?: 'h1' | 'h2' | 'p' | 'dt' | 'dd' | 'b' | 'label'
  type?: 'title-1' | 'title-2' | 'title-3' | 'body-1' | 'body-2'
  color?: 'secondary' | 'error'
  weight?: 'semibold' | 'regular'
  className?: string
}

export const Text: FC<TextPropsType> = ({
  children,
  as = 'p',
  type = 'body-1',
  color = 'secondary',
  weight,
  className,
  ...rest
}) => {
  const typeClass = styles[`Text--${type}`]
  const colorClass = styles[`Text--${color}`]
  const weightClass = styles[`Text--${weight}`]

  const Element = as as ElementType

  return (
    <Element
      className={classNames(styles.Text, typeClass, colorClass, weightClass, className)}
      {...rest}
    >
      {children}
    </Element>
  )
}
