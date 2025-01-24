import { render, renderHook, screen } from '@testing-library/react'
import { useAtom } from 'jotai'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactElement } from 'react'
import { cartAtom, distanceAtom, venueDataAtom } from '../../atoms'
import { Total } from './Total'
import { useTotal } from '../../hooks/useTotal'

const mockUseAtom = (value: unknown) => [value, vi.fn()] as [unknown, never]

vi.mock('jotai', async () => {
  const actual = await vi.importActual('jotai')
  return {
    ...actual,
    useAtom: vi.fn()
  }
})

const queryClient = new QueryClient()
const renderWithClient = (children: ReactElement) =>
  render(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>)

describe('Total', () => {
  beforeEach(() => {
    vi.mocked(useAtom).mockImplementation(atom => {
      if (atom === cartAtom) return mockUseAtom({ value: '3' })
      if (atom === distanceAtom) return mockUseAtom(750)
      if (atom === venueDataAtom)
        return mockUseAtom({
          basePrice: 500,
          orderMinimumNoSurcharge: 1000,
          distanceRanges: [
            { min: 0, max: 500, a: 0, b: 0 },
            { min: 500, max: 1000, a: 100, b: 1 },
            { min: 1000, max: 0, a: 0, b: 0 }
          ]
        })
      return mockUseAtom(null)
    })
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders the default message when no data is provided', () => {
    vi.mocked(useAtom).mockImplementation(atom => {
      if (atom === cartAtom) return mockUseAtom({ value: '' })
      if (atom === distanceAtom) return mockUseAtom(null)
      if (atom === venueDataAtom) return mockUseAtom(null)
      return mockUseAtom(null)
    })

    renderWithClient(<Total />)

    expect(screen.getByText('Prices in EUR')).toBeInTheDocument()
    expect(screen.getByText('Fill details form to see total')).toBeInTheDocument()
    expect(screen.queryByText('Delivery')).not.toBeInTheDocument()
  })

  it('renders the correct values when data is provided', () => {
    renderWithClient(<Total />)

    expect(screen.getByText('Prices in EUR')).toBeInTheDocument()
    expect(screen.getByText('Cart value')).toBeInTheDocument()
    expect(screen.getByText('€7.00')).toBeInTheDocument()
    expect(screen.getByText('Delivery')).toBeInTheDocument()
    expect(screen.getByText('(750 m)')).toBeInTheDocument()
    expect(screen.getByText('€6.75')).toBeInTheDocument()
    expect(screen.getByText('Small order surcharge')).toBeInTheDocument()
    expect(screen.getByText('€3.00')).toBeInTheDocument()
    expect(screen.getByText('Total')).toBeInTheDocument()
    expect(screen.getByText('€16.75')).toBeInTheDocument()
  })

  it('displays an error message when delivery distance exceeds the limit', () => {
    vi.mocked(useAtom).mockImplementation(atom => {
      if (atom === cartAtom) return mockUseAtom({ value: '10' })
      if (atom === distanceAtom) return mockUseAtom(1500)
      if (atom === venueDataAtom)
        return mockUseAtom({
          basePrice: 500,
          orderMinimumNoSurcharge: 1000,
          distanceRanges: [
            { min: 0, max: 500, a: 0, b: 0 },
            { min: 500, max: 1000, a: 100, b: 1 },
            { min: 1000, max: 0, a: 0, b: 0 }
          ]
        })
      return mockUseAtom(null)
    })

    renderWithClient(<Total />)

    expect(
      screen.getByText('Delivery is not possible: 1500 meters is beyond our limit of 1000 meters.')
    ).toBeInTheDocument()
  })

  it('calculates formattedData correctly', () => {
    const { result } = renderHook(() => useTotal(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )
    })

    expect(result.current.formattedData).toEqual([
      { key: 'cart', value: 300 },
      { key: 'deliveryFee', value: 675 },
      { key: 'smallOrderSurcharge', value: 700 }
    ])
  })

  it('calculates total correctly', () => {
    const { result } = renderHook(() => useTotal(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )
    })

    expect(result.current.total).toBe(1675)
  })

  it('handles empty cart correctly', () => {
    vi.mocked(useAtom).mockImplementation(atom => {
      if (atom === cartAtom) return mockUseAtom({ value: '' })
      if (atom === distanceAtom) return mockUseAtom(900)
      if (atom === venueDataAtom)
        return mockUseAtom({
          basePrice: 500,
          orderMinimumNoSurcharge: 1000,
          distanceRanges: [
            { min: 0, max: 500, a: 0, b: 0 },
            { min: 500, max: 1000, a: 100, b: 1 },
            { min: 1000, max: 0, a: 0, b: 0 }
          ]
        })
      return mockUseAtom(null)
    })

    const { result } = renderHook(() => useTotal(), {
      wrapper: ({ children }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      )
    })

    expect(result.current.formattedData).toEqual([
      { key: 'cart', value: 0 },
      { key: 'deliveryFee', value: 690 },
      { key: 'smallOrderSurcharge', value: 1000 }
    ])
    expect(result.current.total).toBe(1690)
  })
})
