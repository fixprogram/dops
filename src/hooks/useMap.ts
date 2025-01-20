import mapboxgl, { LngLatBoundsLike, LngLatLike } from 'mapbox-gl'
import { Feature, LineString, Point } from 'geojson'
import { useCallback, useEffect, useRef, useState } from 'react'
import { length } from '@turf/length'

import VenuePointIcon from '../assets/venue-point-icon.svg'
import UserPointIcon from '../assets/user-point-icon.svg'
import { useAtom } from 'jotai'
import { distanceAtom } from '../atoms'

const ICONS = [
  { src: VenuePointIcon, name: 'venue-icon' },
  { src: UserPointIcon, name: 'user-icon' }
]

const SOURCE_ID = 'source_points'
const LAYER_ID = 'layer_points'

const DEFAULT_ZOOM = 10.12
const DEFAULT_COORDS: LngLatLike = [24.92813512, 60.17012143]

const MAP_PADDING = { left: 600, right: 100, top: 100, bottom: 100 }
const MAX_ZOOM = 15
const FLY_TO_ZOOM = 13

export const useMap = () => {
  const map = useRef<mapboxgl.Map | null>(null)

  const [venuePoint, setVenuePoint] = useState<Feature<Point> | null>(null)
  const [customerPoint, setCustomerPoint] = useState<Feature<Point> | null>(null)

  const [, setDistance] = useAtom(distanceAtom)

  const initializeMap = useCallback(() => {
    map.current = new mapboxgl.Map({
      container: 'map',
      center: DEFAULT_COORDS,
      zoom: DEFAULT_ZOOM,
      style: 'mapbox://styles/mapbox/light-v11'
    })

    map.current.on('load', () => {
      map.current?.addSource(SOURCE_ID, {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      })

      ICONS.forEach(({ src, name }) => {
        const img = new Image(24, 24)
        img.src = src
        img.onload = () => map.current?.addImage(name, img)
      })

      map.current?.addLayer({
        id: LAYER_ID,
        type: 'symbol',
        source: SOURCE_ID,
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
  }, [])

  const fitMapToBounds = useCallback((features: Feature<Point>[]) => {
    if (features.length === 0 || !map.current) return

    const coordinates = features.map(f => f.geometry.coordinates)
    if (coordinates.length === 1) {
      map.current.flyTo({
        center: coordinates[0] as [number, number],
        zoom: FLY_TO_ZOOM,
        duration: 1000
      })
    } else {
      const bounds: LngLatBoundsLike = coordinates.reduce(
        ([min, max], [lng, lat]) => [
          [Math.min(min[0], lng), Math.min(min[1], lat)],
          [Math.max(max[0], lng), Math.max(max[1], lat)]
        ],
        [
          [Infinity, Infinity],
          [-Infinity, -Infinity]
        ]
      )
      map.current.fitBounds(bounds, { padding: MAP_PADDING, maxZoom: MAX_ZOOM, duration: 1000 })
    }
  }, [])

  const updateMapSource = useCallback(
    (features: Feature<Point>[]) => {
      const source = map.current?.getSource(SOURCE_ID) as mapboxgl.GeoJSONSource | undefined
      if (!source) return

      if (features.length === 2) {
        const line = {
          type: 'Feature',
          geometry: { type: 'LineString', coordinates: features.map(f => f.geometry.coordinates) },
          properties: {}
        } as Feature<LineString>

        setDistance(Math.floor(length(line, { units: 'meters' })))
      } else {
        setDistance(null)
      }

      source.setData({ type: 'FeatureCollection', features })
      fitMapToBounds(features)
    },
    [setDistance, fitMapToBounds]
  )

  const addPoint = useCallback((type: 'venue' | 'user', coordinates: [number, number]) => {
    const point: Feature<Point> = {
      type: 'Feature',
      geometry: { type: 'Point', coordinates },
      properties: { id: String(Date.now()), type }
    }
    return type === 'venue' ? setVenuePoint(point) : setCustomerPoint(point)
  }, [])

  const removePoint = useCallback(
    (type: 'venue' | 'user') => (type === 'venue' ? setVenuePoint(null) : setCustomerPoint(null)),
    []
  )

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY
    initializeMap()
    return () => map.current?.remove()
  }, [initializeMap])

  useEffect(() => {
    updateMapSource([venuePoint, customerPoint].filter(Boolean) as Feature<Point>[])
  }, [venuePoint, customerPoint, updateMapSource])

  const addVenue = useCallback((coords: [number, number]) => addPoint('venue', coords), [addPoint])
  const addUser = useCallback((coords: [number, number]) => addPoint('user', coords), [addPoint])

  const removeVenue = useCallback(() => removePoint('venue'), [removePoint])
  const removeUser = useCallback(() => removePoint('user'), [removePoint])

  return {
    addVenue,
    addUser,
    removeVenue,
    removeUser
  }
}
