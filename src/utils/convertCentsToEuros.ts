export const convertCentsToEuros = (value: number) => {
  if (value === 0) return '€0'

  const euros = Math.floor(value / 100)
  const cents = value % 100

  const formattedCents = cents < 10 ? `0${cents}` : cents.toFixed(0)

  return `€${euros}.${formattedCents}`
}
