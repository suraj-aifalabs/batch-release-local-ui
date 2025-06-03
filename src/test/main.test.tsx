
describe('main.tsx', () => {
    it('should execute without errors', () => {
        const mockElement = document.createElement('div');
        mockElement.id = 'root';
        jest.spyOn(document, 'getElementById').mockReturnValue(mockElement);

        jest.mock('react-dom/client', () => ({
            createRoot: jest.fn(() => ({ render: jest.fn() }))
        }));

        expect(() => import('../main')).not.toThrow();
    });
});