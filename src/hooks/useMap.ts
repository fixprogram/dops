import mapboxgl from 'mapbox-gl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { length } from '@turf/length'

interface Feature {
  type: string
  geometry: { type: string; coordinates: [number, number] }
  properties: { id: string }
}

export const useMap = () => {
  const geojson = useRef<{ type: 'FeatureCollection'; features: Feature[] }>({
    type: 'FeatureCollection',
    features: []
  })
  const [distance, setDistance] = useState<number | null>(null)

  const addPoint = useCallback(
    (coordinates: [number, number]) => {
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates
        },
        properties: {
          id: String(new Date().getTime())
        }
      }

      geojson.current.features = [...geojson.current.features, point]

      if (geojson.current.features.length > 1) {
        // linestring.geometry.coordinates = geojson.features.map(
        //     (point) => point.geometry.coordinates
        // );

        const linestring = {
          type: 'Feature',
          geometry: {
            type: 'LineString',
            coordinates: geojson.current.features.map(point => point.geometry.coordinates)
          }
        }

        geojson.current.features.push(linestring)

        setDistance(Math.floor(length(linestring, { units: 'meters' })))
      }

      mapRef.current.getSource('geojson').setData(geojson.current)
    },
    [geojson]
  )

  const mapRef = useRef<mapboxgl.Map | null>(null)

  useEffect(() => {
    if (mapContainerRef.current === null) {
      return
    }
    // if (mapRef.current !== null) {
    //   return
    // }

    // mapboxgl.accessToken =
    //   'pk.eyJ1IjoiZGF2eWRvdiIsImEiOiJjbTV2MWptYWowMzFyMmlyMWF3YncxaGkxIn0.pJXvj_wJYt9J6-IPDLXorA' // TODO: .env
    // mapRef.current = new mapboxgl.Map({
    //   container: mapContainerRef.current,
    //   center: [24.92813512, 60.17012143],
    //   zoom: 10.12,
    //   style: 'mapbox://styles/mapbox/light-v11'
    // })

    // mapRef.current.on('load', () => {
    //   mapRef.current.addSource('geojson', {
    //     type: 'geojson',
    //     data: geojson.current
    //   })

    //   mapRef.current.addLayer({
    //     id: 'measure-points',
    //     type: 'circle',
    //     source: 'geojson',
    //     paint: {
    //       'circle-radius': 5,
    //       'circle-color': '#000'
    //     },
    //     filter: ['in', '$type', 'Point']
    //   })
    //   mapRef.current.addLayer({
    //     id: 'measure-lines',
    //     type: 'line',
    //     source: 'geojson',
    //     layout: {
    //       'line-cap': 'round',
    //       'line-join': 'round'
    //     },
    //     paint: {
    //       'line-color': '#000',
    //       'line-width': 2.5
    //     },
    //     filter: ['in', '$type', 'LineString']
    //   })
    // })

    // return () => {
    //   mapRef.current.remove()
    // }
  }, [])

  const mapContainerRef = useRef()

  return { mapContainerRef, addPoint, distance }
}
