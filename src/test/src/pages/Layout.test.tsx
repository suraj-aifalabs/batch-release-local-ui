import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import Layout from '@/pages/Layout';

const MockChild = () => <div>Child Route Content</div>;

describe('Layout Component', () => {
    test('renders the Outlet content', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        <Route index element={<MockChild />} />
                    </Route>
                </Routes>
            </MemoryRouter>
        );

        expect(screen.getByText('Child Route Content')).toBeInTheDocument();
    });
});
