import mapboxgl from 'mapbox-gl'
import { useCallback, useEffect, useRef, useState } from 'react'
import { length } from '@turf/length'

import VenuePointIcon from '../assets/venue-point-icon.svg'
import UserPointIcon from '../assets/user-point-icon.svg'

const icons = [
  {
    src: VenuePointIcon,
    name: 'venue-icon'
  },
  {
    src: UserPointIcon,
    name: 'user-icon'
  }
]

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

  const fitMapToBounds = () => {
    if (!mapRef.current || geojson.current.features.length === 0) {
      return
    }

    const coordinates = geojson.current.features
      .filter(feature => feature.geometry.type === 'Point')
      .map(feature => feature.geometry.coordinates)

    if (coordinates.length === 1) {
      return mapRef.current.flyTo({
        center: coordinates[0],
        zoom: 13, // Adjust the zoom level as needed
        duration: 1000 // Optional: Animation duration
      })
    }

    const bounds = coordinates.reduce(
      (acc, coord) => {
        acc[0][0] = Math.min(acc[0][0], coord[0]) // Min longitude
        acc[0][1] = Math.min(acc[0][1], coord[1]) // Min latitude
        acc[1][0] = Math.max(acc[1][0], coord[0]) // Max longitude
        acc[1][1] = Math.max(acc[1][1], coord[1]) // Max latitude
        return acc
      },
      [
        [Infinity, Infinity], // Initial min
        [-Infinity, -Infinity] // Initial max
      ]
    )

    mapRef.current.fitBounds(bounds, {
      padding: 50, // Add padding around the points
      maxZoom: 15, // Optional: set a maximum zoom level
      duration: 1000 // Optional: animation duration in milliseconds
    })
  }

  const addPoint = useCallback(
    (coordinates: [number, number], isUser = false) => {
      const point = {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates
        },
        properties: {
          id: String(new Date().getTime()),
          type: isUser ? 'user' : 'venue'
        }
      }

      geojson.current.features = [...geojson.current.features, point]

      if (geojson.current.features.length > 1) {
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

      fitMapToBounds()
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

    mapboxgl.accessToken =
      'pk.eyJ1IjoiZGF2eWRvdiIsImEiOiJjbTV2MWptYWowMzFyMmlyMWF3YncxaGkxIn0.pJXvj_wJYt9J6-IPDLXorA' // TODO: .env
    mapRef.current = new mapboxgl.Map({
      container: 'map',
      center: [24.92813512, 60.17012143],
      zoom: 10.12,
      style: 'mapbox://styles/mapbox/light-v11'
    })

    mapRef.current.on('load', () => {
      mapRef.current.addSource('geojson', {
        type: 'geojson',
        data: geojson.current
      })
      // mapRef.current.addSource('venue', {
      //   type: 'geojson',
      //   data: venueRef.current
      // })

      for (const { src, name } of icons) {
        const customIcon = new Image(24, 24)
        customIcon.src = src
        customIcon.onload = () => mapRef.current.addImage(name, customIcon)
      }

      mapRef.current.addLayer({
        id: 'geojson',
        type: 'symbol',
        source: 'geojson',
        layout: {
          'icon-image': [
            'match',
            ['get', 'type'],
            'user',
            'user-icon',
            'venue',
            'venue-icon',
            'user-icon'
          ],
          'icon-size': 1
        }
      })
    })

    return () => {
      mapRef.current?.remove()
    }
  }, [])

  const mapContainerRef = useRef<HTMLElement>()

  return { mapContainerRef, addPoint, distance }
}
