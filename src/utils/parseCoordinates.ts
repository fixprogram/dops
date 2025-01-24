export const parseCoordinates = (coordinates: string) =>
  coordinates
    .split(/, |,| /)
    .map(Number)
    .reverse() as [number, number] // Mapbox works with GeoJSON which means [longitude, latitude] instead of conventional [latitude, longitude]
