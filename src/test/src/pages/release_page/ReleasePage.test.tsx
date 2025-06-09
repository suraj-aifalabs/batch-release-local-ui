import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReleasePage from '../../../../pages/release_page/ReleasePage';
import ViewPdf from '../../../../pages/release_page//ViewPdf';

jest.mock('../../../../pages/release_page//ViewPdf', () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid="fill-preview-mock">Mock FillAndPreviewPDF</div>)
}));


describe('ReleasePage component', () => {
    it('renders without crashing', () => {
        render(<ReleasePage />);
        expect(screen.getByTestId('fill-preview-mock')).toBeInTheDocument();
    });

    it('renders the FillAndPreviewPDF component', () => {
        render(<ReleasePage />);
        expect(ViewPdf).toHaveBeenCalled();
    });

    it('has correct layout structure', () => {
        const { container } = render(<ReleasePage />);

        const outerDiv = container.firstChild;
        expect(outerDiv).toBeInTheDocument();
        expect(outerDiv).toHaveStyle('display: block'); // Default div display

        const flexContainer = outerDiv?.firstChild;
        expect(flexContainer).toHaveStyle({
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            justifyContent: 'space-between'
        });

        const nestedFlexContainer = flexContainer?.firstChild;
        expect(nestedFlexContainer).toHaveStyle({
            display: 'flex',
            alignSelf: 'center',
            marginTop: '20px',
            justifyContent: 'center'
        });
    });

    it('positions FillAndPreviewPDF correctly', () => {
        render(<ReleasePage />);
        const fillPreviewComponent = screen.getByTestId('fill-preview-mock');
        const parentDiv = fillPreviewComponent.parentElement;

        expect(parentDiv).toHaveStyle({
            display: 'flex',
            alignSelf: 'center',
            marginTop: '20px',
            justifyContent: 'center'
        });
    });

    it('matches snapshot', () => {
        const { asFragment } = render(<ReleasePage />);
        expect(asFragment()).toMatchSnapshot();
    });
});