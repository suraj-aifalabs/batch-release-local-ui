import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Input } from '@/components/ui/input'

describe('Input component', () => {
    it('renders with default props', () => {
        render(<Input type="test" />)
        const input = screen.getByRole('textbox')

        expect(input).toBeInTheDocument()
        expect(input).toHaveAttribute('type')
        expect(input).toHaveAttribute('data-slot', 'input')
    })

    it('renders children value correctly', () => {
        render(<Input defaultValue="Test Value" />)
        expect(screen.getByRole('textbox')).toHaveValue('Test Value')
    })

    it('applies custom className', () => {
        render(<Input className="custom-class" />)
        expect(screen.getByRole('textbox')).toHaveClass('custom-class')
    })

    it('includes default styling classes', () => {
        render(<Input />)
        const input = screen.getByRole('textbox')

        expect(input).toHaveClass('h-9')
        expect(input).toHaveClass('rounded-md')
        expect(input).toHaveClass('border')
        expect(input).toHaveClass('px-3')
        expect(input).toHaveClass('py-1')
        expect(input).toHaveClass('focus-visible:ring-[3px]')
    })


    it('applies disabled state correctly', () => {
        render(<Input disabled />)
        const input = screen.getByRole('textbox')

        expect(input).toBeDisabled()
        expect(input).toHaveClass('disabled:opacity-50')
        expect(input).toHaveClass('disabled:pointer-events-none')
    })

    it('applies invalid state styles', () => {
        render(<Input aria-invalid="true" />)
        const input = screen.getByRole('textbox')

        expect(input).toHaveAttribute('aria-invalid', 'true')
        expect(input).toHaveClass('aria-invalid:border-destructive')
        expect(input).toHaveClass('dark:aria-invalid:ring-destructive/40')
    })

    it('spreads additional props', () => {
        render(<Input id="test-input" placeholder="Enter text" />)
        const input = screen.getByRole('textbox')

        expect(input).toHaveAttribute('id', 'test-input')
        expect(input).toHaveAttribute('placeholder', 'Enter text')
    })

})