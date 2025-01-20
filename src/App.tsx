import { Total } from './components/total/total'
import { DetailsForm } from './components/DetailsForm/DetailsForm'
import { Provider } from 'jotai'
import { ProjectMap } from './components/map/map'

import 'mapbox-gl/dist/mapbox-gl.css'
import styles from './App.module.css'

function App() {
  return (
    <Provider>
      <ProjectMap />

      <div className={styles.Container}>
        <DetailsForm />
        <Total />
      </div>
    </Provider>
  )
}

export default App
