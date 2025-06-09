import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import LandingPage from '@/pages/LandingPage';
import CustomContainer from '@/custom_components/CustomContainer';
import { MemoryRouter } from 'react-router-dom';

jest.mock('@/custom_components/CustomButton', () => {
    return jest.fn(({ text, ...props }) => (
        <button {...props}>{text}</button>
    ));
});

jest.mock('@/custom_components/CustomContainer', () => {
    return jest.fn(({ children }) => (
        <div data-testid="custom-container">{children}</div>
    ));
});

describe('LandingPage component', () => {
    it('renders without crashing', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );
        expect(screen.getByTestId('custom-container')).toBeInTheDocument();
    });



    it('wraps content in CustomContainer', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        expect(CustomContainer).toHaveBeenCalled();
        const container = screen.getByTestId('custom-container');
        expect(container).toBeInTheDocument();
    });

    it('has correct link navigation', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', '/setting/release');
    });

    it('applies correct layout styles', () => {
        render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );

        const innerDiv = screen.getByTestId('custom-container').firstChild;
        expect(innerDiv).toHaveClass('flex');
        expect(innerDiv).toHaveClass('flex-col');
        expect(innerDiv).toHaveClass('justify-center');
        expect(innerDiv).toHaveClass('items-center');
        expect(innerDiv).toHaveClass('h-[90dvh]');
        expect(innerDiv).toHaveClass('gap-4');
        expect(innerDiv).toHaveClass('w-full');
    });

    it('matches snapshot', () => {
        const { asFragment } = render(
            <MemoryRouter>
                <LandingPage />
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });
});