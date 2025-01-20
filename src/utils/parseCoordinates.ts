export const parseCoordinates = (coordinates: string) => {
  return coordinates.split(/, |,| /).map(Number) as [number, number]
}
