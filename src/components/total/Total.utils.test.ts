import { convertCentsToEuros } from './Total.utils'

describe('convertCentsToEuros', () => {
  it('should convert positive cents to euros', () => {
    const input = 12345
    const output = convertCentsToEuros(input)
    expect(output).toBe('€123.45')
  })

  it('should convert zero cents to euros', () => {
    const input = 0
    const output = convertCentsToEuros(input)
    expect(output).toBe('€0.00')
  })

  it('should handle cents less than 100', () => {
    const input = 99
    const output = convertCentsToEuros(input)
    expect(output).toBe('€0.99')
  })
})
