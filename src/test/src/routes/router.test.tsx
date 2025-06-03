import { render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter } from 'react-router-dom'
import '@testing-library/jest-dom'
import { router } from '@/routes/router'
import Layout from '@/pages/Layout'
import LandingPage from '@/pages/LandingPage'
import ReleasePage from '@/pages/release_page/ReleasePage';

// Mock the page components
jest.mock('@/pages/Layout', () => () => <div>Layout Mock</div>)
jest.mock('@/pages/LandingPage', () => () => <div>LandingPage Mock</div>)
jest.mock('@/pages/release_page/ReleasePage', () => () => <div>ReleasePage Mock</div>)

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
        expect(screen.getByText('LandingPage Mock')).toBeInTheDocument()
    })

    it('should render LandingPage as index route of /setting', () => {
        const testRouter = createMemoryRouter(router.routes, {
            initialEntries: ['/setting']
        })

        render(<RouterProvider router={testRouter} />)
        expect(screen.getByText('LandingPage Mock')).toBeInTheDocument()
    })

    it('should render ReleasePage for /setting/release path', () => {
        const testRouter = createMemoryRouter(router.routes, {
            initialEntries: ['/setting/release']
        })

        render(<RouterProvider router={testRouter} />)
        expect(screen.getByText('Layout Mock')).toBeInTheDocument()
        expect(screen.getByText('ReleasePage Mock')).toBeInTheDocument()
    })

    it('should match snapshot of router configuration', () => {
        expect(router.routes).toMatchSnapshot()
    })

    it('should have correct route structure', () => {
        expect(router.routes).toHaveLength(2)

        expect(router.routes[0].path).toBe('/')
        expect(router.routes[0].element.type.name).toBe('Navigate')

        expect(router.routes[1].path).toBe('/setting')
        expect(router.routes[1].element.type.name).toBe('Layout')

        expect(router.routes[1].children).toHaveLength(2)
        expect(router.routes[1].children?.[0].index).toBe(true)
        expect(router.routes[1].children?.[0].element.type.name).toBe('LandingPage')
        expect(router.routes[1].children?.[1].path).toBe('release')
        expect(router.routes[1].children?.[1].element.type.name).toBe('ReleasePage')
    })
})