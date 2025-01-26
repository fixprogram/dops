import { parseCoordinates, validateCoordinates } from './ProjectMap.utils'

describe('parseCoordinates', () => {
  it('should parse coordinates with comma and space separator', () => {
    const input = '52.5200, 13.4050'
    const output = parseCoordinates(input)
    expect(output).toEqual([13.405, 52.52])
  })

  it('should parse coordinates with comma separator', () => {
    const input = '52.5200,13.4050'
    const output = parseCoordinates(input)
    expect(output).toEqual([13.405, 52.52])
  })

  it('should parse coordinates with space separator', () => {
    const input = '52.5200 13.4050'
    const output = parseCoordinates(input)
    expect(output).toEqual([13.405, 52.52])
  })
})

describe('validateCoordinates', () => {
  it('should return true for valid coordinates', () => {
    const input = '52.5200, 13.4050'
    const output = validateCoordinates(input)
    expect(output).toBe(true)
  })

  it('should return false for invalid coordinates format', () => {
    const input = 'invalid'
    const output = validateCoordinates(input)
    expect(output).toBe(false)
  })

  it('should return false for out-of-range latitude', () => {
    const input = '91.0000, 13.4050'
    const output = validateCoordinates(input)
    expect(output).toBe(false)
  })

  it('should return false for out-of-range longitude', () => {
    const input = '52.5200, 181.0000'
    const output = validateCoordinates(input)
    expect(output).toBe(false)
  })
})
