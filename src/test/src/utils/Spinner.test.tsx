import { render, screen } from '@testing-library/react';
import { Spinner } from '@/utils/Spinner';
import '@testing-library/jest-dom';

afterEach(() => {
    cleanup();
});

describe('Spinner Component', () => {
    test('renders the spinner container', () => {
        render(<Spinner />);
        const spinner = screen.getByTestId('spinner');
        expect(spinner).toBeInTheDocument();
        expect(spinner.tagName).toBe('DIV');
    });

    test('container has correct Tailwind classes', () => {
        render(<Spinner />);
        const spinner = screen.getByTestId('spinner');
        expect(spinner).toHaveClass('flex', 'space-x-2', 'justify-center', 'items-center');
    });

    test('renders three dot elements', () => {
        render(<Spinner />);
        const dots = screen.getAllByTestId(/dot-\d/);
        expect(dots).toHaveLength(3);
        dots.forEach((dot) => {
            expect(dot.tagName).toBe('DIV');
        });
    });

    test('dots have correct Tailwind classes', () => {
        render(<Spinner />);
        const dots = screen.getAllByTestId(/dot-\d/);
        dots.forEach((dot) => {
            expect(dot).toHaveClass('h-2', 'w-2', 'bg-blue-500', 'rounded-full', 'animate-bounce');
        });
    });


});

function cleanup() {
    document.body.innerHTML = '';
}
