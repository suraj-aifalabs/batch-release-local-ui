import { render, screen, cleanup } from '@testing-library/react';
import { CustomLabel } from '@/custom_components/CustomLabel';
import '@testing-library/jest-dom';

jest.mock('@/components/ui/label', () => ({
    Label: ({ children, className, ...props }: { children: React.ReactNode; className?: string }) => (
        <label data-testid="custom-label" className={className} {...props}>
            {children}
        </label>
    ),
}));

afterEach(() => {
    cleanup();
});

describe('CustomLabel Component', () => {
    test('renders with default props', () => {
        render(<CustomLabel />);
        const label = screen.getByTestId('custom-label');
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent('');
        expect(label).toHaveAttribute('class', '');
        expect(label.tagName).toBe('LABEL');
    });

    test('renders with custom labelName', () => {
        render(<CustomLabel labelName="Username" />);
        const label = screen.getByText('Username');
        expect(label).toBeInTheDocument();
        expect(label).toHaveTextContent('Username');
        expect(label).toHaveAttribute('data-testid', 'custom-label');
    });

    test('applies custom className', () => {
        render(<CustomLabel labelName="Username" className="custom-label" />);
        const label = screen.getByText('Username');
        expect(label).toHaveClass('custom-label');
        expect(label).toHaveAttribute('data-testid', 'custom-label');
    });

    test('forwards htmlFor prop', () => {
        render(<CustomLabel labelName="Username" htmlFor="username-input" />);
        const label = screen.getByText('Username');
        expect(label).toHaveAttribute('for', 'username-input');
        expect(label).toHaveAttribute('data-testid', 'custom-label');
    });

    test('is accessible with an associated input', () => {
        render(
            <div>
                <CustomLabel labelName="Username" htmlFor="username-input" />
                <input id="username-input" type="text" />
            </div>
        );
        const input = screen.getByLabelText('Username');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('id', 'username-input');
        const label = screen.getByText('Username');
        expect(label).toHaveAttribute('data-testid', 'custom-label');
    });
});