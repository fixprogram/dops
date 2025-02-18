import { Provider } from 'jotai'
import 'mapbox-gl/dist/mapbox-gl.css'
import { Total } from '@/components/Total'
import { DetailsForm } from '@/components/DetailsForm'
import { ProjectMap } from '@/components/ProjectMap'
import { IconsSprite } from '@/shared/components/IconsSprite'

import styles from './App.module.scss'

export const App = () => (
  <>
    <IconsSprite />
    <Provider>
      <ProjectMap />

      <div className={styles.Container}>
        <DetailsForm />
        <Total />
      </div>
    </Provider>
  </>
)
