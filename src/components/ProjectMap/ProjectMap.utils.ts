export const parseCoordinates = (coordinates: string) =>
  coordinates
    .split(/, |,| /)
    .map(Number)
    .reverse() as [number, number] // Mapbox works with GeoJSON which means [longitude, latitude] instead of conventional [latitude, longitude]

export const validateCoordinates = (coordinates: string) =>
  /^(-?(?:[1-8]?\d(?:\.\d{1,7})?|90(?:\.0{1,7})?)),\s*(-?(?:1[0-7]\d(?:\.\d{1,7})?|[1-9]?\d(?:\.\d{1,7})?|180(?:\.0{1,7})?))$/.test(
    coordinates
  )
