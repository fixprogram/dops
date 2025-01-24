import { FC } from 'react'
import classNames from 'classnames'

import styles from './Icon.module.css'

type IconName = 'city' | 'cart' | 'location' | 'pin' | 'error'
type IconColor = 'primary' | 'secondary'

export const Icon: FC<{ name: IconName; className?: string; color?: IconColor }> = ({
  name,
  className,
  color = 'primary'
}) => {
  return (
    <svg
      className={classNames(
        styles.Icon,
        color === 'primary' ? styles.IconPrimary : styles.IconSecondary,
        className
      )}
    >
      <use href={`#${name}`} />
    </svg>
  )
}
