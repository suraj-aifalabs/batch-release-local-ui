import { render, screen, fireEvent } from '@testing-library/react';
import CustomButton from '@/custom_components/CustomButton';

jest.mock('@/utils/Spinner', () => ({
    Spinner: () => <div data-testid="spinner">Spinner</div>
}));

describe('CustomButton Component', () => {
    it('renders with default props', () => {
        render(<CustomButton />);
        const button = screen.getByRole('button');

        expect(button).toBeInTheDocument();
        expect(button).toHaveClass('bg-[#000000]');
        expect(button).not.toHaveTextContent('Button');
    });

    it('renders with custom text', () => {
        render(<CustomButton text="Submit" />);
        expect(screen.getByText('Submit')).toBeInTheDocument();
    });

    it('renders with custom icon', () => {
        const CustomIcon = () => <span data-testid="custom-icon">ICON</span>;
        render(<CustomButton icon={<CustomIcon />} />);
        expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
        expect(screen.queryByTestId('spinner')).not.toBeInTheDocument();
    });

    it.each([
        ['primary' as const, 'bg-[#EB1700]'],
        ['secondary' as const, 'bg-white'],
        ['default' as const, 'bg-[#000000]']
    ])('applies correct styles for %s type', (type, expectedClass) => {
        render(<CustomButton type={type} />);
        expect(screen.getByRole('button')).toHaveClass(expectedClass);
    });

    it('shows spinner when loading', () => {
        render(<CustomButton isLoading={true} text="Loading" />);
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
        expect(screen.getByText('Loading')).toBeInTheDocument();
    });

    it('is disabled when disabled prop is true', () => {
        render(<CustomButton disabled={true} />);
        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:cursor-not-allowed');
    });

    it('is disabled when isLoading is true', () => {
        render(<CustomButton isLoading={true} />);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('triggers onClick handler', () => {
        const handleClick = jest.fn();
        render(<CustomButton onClick={handleClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('renders ArrowRight icon by default', () => {
        render(<CustomButton />);
        const arrowIcon = screen.getByRole('button').querySelector('.lucide-arrow-right');
        expect(arrowIcon).toBeInTheDocument();
        expect(arrowIcon).toHaveClass('w-5 h-5');
    });

    it('merges custom className with base classes', () => {
        render(<CustomButton className="custom-class" />);
        expect(screen.getByRole('button')).toHaveClass('custom-class');
    });

    it('has full width style', () => {
        render(<CustomButton />);
        expect(screen.getByRole('button')).toHaveClass('w-full');
    });
});