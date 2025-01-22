import { FC } from 'react'
import classNames from 'classnames'

import styles from './Icon.module.css'

type IconName = 'city' | 'cart' | 'location' | 'pin'
type IconColor = 'primary' | 'secondary'

export const Icon: FC<{ name: IconName; color?: IconColor }> = ({ name, color = 'primary' }) => {
  return (
    <svg
      className={classNames(
        styles.Icon,
        color === 'primary' ? styles.IconPrimary : styles.IconSecondary
      )}
    >
      <use href={`#${name}`} />
    </svg>
  )
}
