import { FC, ReactNode } from 'react'

import styles from './Title.module.css'

export const Title: FC<{ children: ReactNode }> = ({ children }) => (
  <h1 className={styles.Title}>{children}</h1>
)
