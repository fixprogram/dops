export const convertCentsToEuros = (value: number) => {
  const totalCents = Math.round(value)
  const euros = Math.floor(totalCents / 100)

  const cents = String(totalCents % 100).padStart(2, '0')

  return `€${euros}.${cents}`
}
