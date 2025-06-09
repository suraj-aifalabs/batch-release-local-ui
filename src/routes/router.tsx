import { createBrowserRouter, Navigate } from 'react-router-dom'
import Layout from '../pages/Layout'
import LandingPage from '../pages/LandingPage'
import ReleasePage from '../pages/release_page/ReleasePage'
import QCManagement from '../pages/config/QCManagement'

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Navigate to="/setting" replace />
    },
    {
        path: "/setting",
        element: <Layout />,
        children: [
            { index: true, element: <LandingPage /> },
            { path: "release", element: <ReleasePage /> },
            { path: "config", element: <QCManagement /> },
        ]
    }
])