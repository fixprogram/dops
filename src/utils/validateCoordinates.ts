export const validateCoordinates = (coordinates: string) => {
  const coordsRegex =
    /^(-?(?:[1-8]?\d(?:\.\d{1,7})?|90(?:\.0{1,7})?)),\s*(-?(?:1[0-7]\d(?:\.\d{1,7})?|[1-9]?\d(?:\.\d{1,7})?|180(?:\.0{1,7})?))$/

  return coordsRegex.test(coordinates)
}
