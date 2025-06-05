import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomContainer from '@/custom_components/CustomContainer';

describe('CustomContainer component', () => {
    it('renders children correctly', () => {
        const testText = 'Test Content';
        render(
            <CustomContainer>
                <div>{testText}</div>
            </CustomContainer>
        );
        expect(screen.getByText(testText)).toBeInTheDocument();
    });

    it('applies default padding class', () => {
        render(
            <CustomContainer>
                <div>Content</div>
            </CustomContainer>
        );
        const container = screen.getByText('Content').parentElement;
        expect(container).toHaveClass('px-4');
    });

    it('renders multiple children correctly', () => {
        render(
            <CustomContainer>
                <div>Child 1</div>
                <div>Child 2</div>
                <div>Child 3</div>
            </CustomContainer>
        );
        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
        expect(screen.getByText('Child 3')).toBeInTheDocument();
    });

    it('renders with complex children', () => {
        render(
            <CustomContainer>
                <header>
                    <h1>Title</h1>
                    <nav>Navigation</nav>
                </header>
                <main>
                    <section>Content Section</section>
                </main>
            </CustomContainer>
        );
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const { container } = render(
            <CustomContainer>
                <div>Snapshot Test</div>
            </CustomContainer>
        );
        expect(container.firstChild).toMatchSnapshot();
    });
});