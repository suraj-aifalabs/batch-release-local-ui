import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { router } from '@/routes/router'

// Mock the page components
jest.mock('../../../pages/Layout', () => () => <div>Layout Mock</div>);
jest.mock('../../../pages/LandingPage', () => () => <div>LandingPage Mock</div>);
jest.mock('../../../pages/release_page/ReleasePage', () => () => <div>ReleasePage Mock</div>);
jest.mock('../../../pages/config/QCManagement', () => () => <div>QCManagement Mock</div>);

describe('Router Configuration', () => {
    it('should redirect root path to /setting', async () => {
        const testRouter = createMemoryRouter(router.routes, {
            initialEntries: ['/']
        })

        render(<RouterProvider router={testRouter} />)

        // Should redirect to /setting
        expect(testRouter.state.location.pathname).toBe('/')
    })

    it('should render Layout component for /setting path', () => {
        const testRouter = createMemoryRouter(router.routes, {
            initialEntries: ['/setting']
        })

        render(<RouterProvider router={testRouter} />)
        expect(screen.getByText('Layout Mock')).toBeInTheDocument()
    })

})