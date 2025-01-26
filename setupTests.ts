import '@testing-library/jest-dom'
import { configure, cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

configure({ testIdAttribute: 'data-test-id' })

afterEach(cleanup)
