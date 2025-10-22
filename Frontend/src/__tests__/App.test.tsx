import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import App from '../App'

describe('App', () => {
  it('renderiza el título Vite + React', () => {
    render(<App />)
    expect(screen.getByText(/Vite \+ React/i)).toBeInTheDocument()
  })
})