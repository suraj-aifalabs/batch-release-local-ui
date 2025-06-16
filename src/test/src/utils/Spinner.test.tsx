import { render, screen } from '@testing-library/react';
import { Spinner } from '@/utils/Spinner';

describe('Spinner', () => {
    it('renders the Spinner component with correct content', () => {
        render(<Spinner />);
        const spinnerElement = screen.getByText('...');
        expect(spinnerElement).toBeInTheDocument();
    });
});
