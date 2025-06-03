
import { render } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Label } from '@/components/ui/label'
describe('Label component', () => {
    it('renders children correctly', () => {
        const { getByText } = render(<Label>Username</Label>)
        expect(getByText('Username')).toBeInTheDocument()
    })

    it('applies custom className', () => {
        const { getByText } = render(<Label className="custom-class">Email</Label>)
        expect(getByText('Email')).toHaveClass('custom-class')
    })

    it('includes default styling classes', () => {
        const { getByText } = render(<Label>Email</Label>)
        const label = getByText('Email')
        expect(label).toHaveClass('flex items-center gap-2 text-sm leading-none font-medium')
    })

    it('spreads additional props', () => {
        const { getByText } = render(<Label htmlFor="input-id">Label</Label>)
        expect(getByText('Label')).toHaveAttribute('for', 'input-id')
    })

    it('has data-slot="label"', () => {
        const { getByText } = render(<Label>Label</Label>)
        expect(getByText('Label')).toHaveAttribute('data-slot', 'label')
    })

})
