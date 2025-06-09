import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomPageHeaderTitle from '@/custom_components/CustomPageHeader';
import { MemoryRouter } from 'react-router-dom';

describe('CustomPageHeaderTitle component', () => {
    const testProps = {
        title: "Test Title",
        link: "/test-link"
    };

    it('renders title correctly', () => {
        render(
            <MemoryRouter>
                <CustomPageHeaderTitle {...testProps} />
            </MemoryRouter>
        );
        expect(screen.getByText(testProps.title)).toBeInTheDocument();
    });

    it('renders back arrow icon with correct link', () => {
        render(
            <MemoryRouter>
                <CustomPageHeaderTitle {...testProps} />
            </MemoryRouter>
        );
        const link = screen.getByRole('link');
        expect(link).toHaveAttribute('href', testProps.link);
        expect(link.querySelector('svg')).toBeInTheDocument();
    });

    it('applies correct styling to title', () => {
        render(
            <MemoryRouter>
                <CustomPageHeaderTitle {...testProps} />
            </MemoryRouter>
        );
        const title = screen.getByText(testProps.title);
        expect(title).toHaveClass('text-2xl');
        expect(title).toHaveClass('text-[#464545]');
        expect(title).toHaveClass('font-bold');
    });

    it('applies correct styling to back button', () => {
        render(
            <MemoryRouter>
                <CustomPageHeaderTitle {...testProps} />
            </MemoryRouter>
        );
        const icon = screen.getByRole('link').querySelector('svg');
        expect(icon).toHaveClass('w-8');
        expect(icon).toHaveClass('h-8');
        expect(icon).toHaveClass('p-1');
        expect(icon).toHaveClass('text-[#464545]');
        expect(icon).toHaveClass('hover:bg-gray-100');
        expect(icon).toHaveClass('rounded-full');
    });

    it('matches snapshot', () => {
        const { container } = render(
            <MemoryRouter>
                <CustomPageHeaderTitle {...testProps} />
            </MemoryRouter>
        );
        expect(container).toMatchSnapshot();
    });

    it('renders with different props', () => {
        const newProps = {
            title: "New Title",
            link: "/new-link"
        };
        render(
            <MemoryRouter>
                <CustomPageHeaderTitle {...newProps} />
            </MemoryRouter>
        );
        expect(screen.getByText(newProps.title)).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute('href', newProps.link);
    });
});