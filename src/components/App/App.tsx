import { Total } from '../Total/Total'
import { DetailsForm } from '../DetailsForm/DetailsForm'
import { Provider } from 'jotai'
import { ProjectMap } from '../ProjectMap/ProjectMap'

import 'mapbox-gl/dist/mapbox-gl.css'
import styles from './App.module.css'
import { IconsSprite } from '../ui/IconsSprite/IconsSprite'

function App() {
  return (
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
}

export default App
