import { FC } from 'react'
import classNames from 'classnames'

import styles from './Icon.module.scss'

interface IconPropsType {
  name: 'city' | 'cart' | 'location' | 'pin' | 'error'
  color?: 'primary' | 'secondary'
  className?: string
}

export const Icon: FC<IconPropsType> = ({ name, className, color = 'primary' }) => (
  <svg className={classNames(styles.Icon, styles[`Icon--${color}`], className)}>
    <use href={`#${name}`} />
  </svg>
)
