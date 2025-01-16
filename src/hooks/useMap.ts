import mapboxgl, { LngLatBoundsLike, LngLatLike } from 'mapbox-gl'
import { Feature, LineString, Point } from 'geojson'
import { useCallback, useEffect, useRef, useState } from 'react'
import { length } from '@turf/length'

import VenuePointIcon from '../assets/venue-point-icon.svg'
import UserPointIcon from '../assets/user-point-icon.svg'
import { useAtom } from 'jotai'
import { distanceAtom } from '../atoms'

const ICONS = [
  {
    src: VenuePointIcon,
    name: 'venue-icon'
  },
  {
    src: UserPointIcon,
    name: 'user-icon'
  }
]

const SOURCE_ID = 'source_points'
const LAYER_ID = 'layer_points'

const DEFAULT_ZOOM = 10.12
const DEFAULT_COORDS: LngLatLike = [24.92813512, 60.17012143]

export const useMap = () => {
  const map = useRef<mapboxgl.Map | null>(null)
  const [features, setFeatures] = useState<Feature<Point>[] | []>([])
  const [, setDistance] = useAtom(distanceAtom)

  const addSource = useCallback(() => {
    map.current!.addSource(SOURCE_ID, {
      type: 'geojson',
      data: { type: 'FeatureCollection', features }
    })
  }, [features])

  const addImages = () => {
    for (const { src, name } of ICONS) {
      const customIcon = new Image(24, 24)
      customIcon.src = src
      customIcon.onload = () => map.current!.addImage(name, customIcon)
    }
  }

  const addLayer = () => {
    map.current!.addLayer({
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
  }

  const fitMapToBounds = useCallback(() => {
    if (!map.current || features.length === 0) {
      return
    }

    const coordinates = features
      .filter(feature => feature.geometry.type === 'Point')
      .map(feature => feature.geometry.coordinates)

    if (coordinates.length === 1) {
      return map.current.flyTo({
        center: coordinates[0] as LngLatLike,
        zoom: 13,
        duration: 1000
      })
    }

    const bounds: LngLatBoundsLike = coordinates.reduce(
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

    map.current.fitBounds(bounds, {
      padding: {
        // TODO: to consts
        left: 600,
        right: 100,
        top: 100,
        bottom: 100
      },
      maxZoom: 15,
      duration: 1000
    })
  }, [features])

  const addPoint = useCallback((coordinates: [number, number], type: 'user' | 'venue') => {
    const point: Feature<Point> = {
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates
      },
      properties: {
        id: String(new Date().getTime()),
        type
      }
    }

    setFeatures(prev => [...prev, point])
  }, [])

  const removePoint = useCallback(
    (pointType: 'user' | 'venue') => {
      setFeatures(prev => prev.filter(point => point.properties?.type !== pointType))
      setDistance(null)
    },
    [setDistance]
  )

  const addVenue = useCallback(
    (coordinates: [number, number]) => {
      addPoint(coordinates, 'venue')
    },
    [addPoint]
  )
  const addUser = useCallback(
    (coordinates: [number, number]) => {
      addPoint(coordinates, 'user')
    },
    [addPoint]
  )

  const removeVenue = useCallback(() => removePoint('venue'), [removePoint])
  const removeUser = useCallback(() => removePoint('user'), [removePoint])

  useEffect(() => {
    if (features.length > 1) {
      const linestring: Feature<LineString> = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: features.map(point => point.geometry.coordinates)
        },
        properties: {}
      }

      setDistance(Math.floor(length(linestring, { units: 'meters' })))
    }
  }, [features, setDistance])

  useEffect(() => {
    mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_KEY
    map.current = new mapboxgl.Map({
      container: 'map',
      center: DEFAULT_COORDS,
      zoom: DEFAULT_ZOOM,
      style: 'mapbox://styles/mapbox/light-v11'
    })

    map.current.on('load', () => {
      addSource()
      addImages()
      addLayer()
    })

    return () => {
      map.current?.remove()
    }
  }, [])

  useEffect(() => {
    const source = map.current?.getSource(SOURCE_ID)
    if (source?.type === 'geojson') {
      source.setData({
        type: 'FeatureCollection',
        features
      })

      fitMapToBounds()
    }
  }, [features, fitMapToBounds])

  return { addVenue, addUser, removeVenue, removeUser }
}
