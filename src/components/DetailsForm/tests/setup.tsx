import { render, renderHook } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { act, ReactElement } from 'react'
import { setupServer } from 'msw/node'
import { useAtom } from 'jotai'
import { slugAtom } from '../../../atoms'

export const queryClient = new QueryClient()
export const renderWithClient = (children: ReactElement) =>
  render(<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>)

export const server = setupServer()

beforeAll(() => {
  Object.defineProperty(navigator, 'geolocation', {
    value: {
      getCurrentPosition: vi.fn()
    },
    writable: true
  })
  server.listen()
})

afterEach(() => {
  server.resetHandlers()

  const { result } = renderHook(() => useAtom(slugAtom))
  act(() => result.current[1]({ value: '' }))
})

afterAll(() => server.close())
