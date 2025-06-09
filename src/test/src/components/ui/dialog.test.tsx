import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"

describe('Dialog component', () => {
    it('renders DialogTrigger correctly', () => {
        render(
            <Dialog>
                <DialogTrigger>Open Dialog</DialogTrigger>
            </Dialog>
        )
        expect(screen.getByText('Open Dialog')).toBeInTheDocument()
        expect(screen.getByText('Open Dialog')).toHaveAttribute('data-slot', 'dialog-trigger')
    })

    it('renders DialogContent with all subcomponents when open', () => {
        render(
            <Dialog defaultOpen>
                <DialogContent data-testid="dialog-content">
                    <DialogHeader>
                        <DialogTitle>Test Title</DialogTitle>
                        <DialogDescription>Test Description</DialogDescription>
                    </DialogHeader>
                    <div>Test Content</div>
                    <DialogFooter>Test Footer</DialogFooter>
                </DialogContent>
            </Dialog>
        )

        expect(screen.getByText('Test Title')).toBeInTheDocument()
        expect(screen.getByText('Test Description')).toBeInTheDocument()
        expect(screen.getByText('Test Content')).toBeInTheDocument()
        expect(screen.getByText('Test Footer')).toBeInTheDocument()

        expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()

        expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
    })

    it('toggles visibility when trigger is clicked', async () => {
        render(
            <Dialog>
                <DialogTrigger>Open Dialog</DialogTrigger>
                <DialogContent>
                    <DialogTitle>Test Dialog</DialogTitle>
                    <DialogDescription>This is a test dialog description.</DialogDescription>
                </DialogContent>
            </Dialog>
        )

        expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument()

        fireEvent.click(screen.getByText('Open Dialog'))
        expect(await screen.findByText('Test Dialog')).toBeInTheDocument()

        fireEvent.click(screen.getByRole('button', { name: /close/i }))

        await waitFor(() => {
            expect(screen.queryByText('Test Dialog')).not.toBeInTheDocument()
        })
    })

    it('applies custom className to DialogContent', () => {
        render(
            <Dialog defaultOpen>
                <DialogContent className="custom-class" data-testid="dialog-content">
                    <DialogTitle>Title</DialogTitle>
                    <DialogDescription>Desc</DialogDescription>
                    Content
                </DialogContent>
            </Dialog>
        )

        expect(screen.getByTestId('dialog-content')).toHaveClass('custom-class')
    })

    it('includes default styling classes', () => {
        render(
            <Dialog defaultOpen>
                <DialogContent data-testid="dialog-content">
                    <DialogTitle>Title</DialogTitle>
                    <DialogDescription>Desc</DialogDescription>
                    Content
                </DialogContent>
            </Dialog>
        )

        const content = screen.getByTestId('dialog-content')
        expect(content).toHaveClass('fixed')
        expect(content).toHaveClass('top-[50%]')
        expect(content).toHaveClass('left-[50%]')
        expect(content).toHaveClass('z-50')
        expect(content).toHaveClass('rounded-lg')
    })

    it('has correct data-slot attributes', () => {
        render(
            <Dialog defaultOpen>
                <DialogTrigger>Trigger</DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Title</DialogTitle>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        )

        expect(screen.getByText('Trigger')).toHaveAttribute('data-slot', 'dialog-trigger')
        expect(screen.getByRole('dialog')).toHaveAttribute('data-slot', 'dialog-content')
        expect(screen.getByText('Title')).toHaveAttribute('data-slot', 'dialog-title')
    })

    it('renders close button with XIcon', () => {
        render(
            <Dialog defaultOpen>
                <DialogContent>Content</DialogContent>
            </Dialog>
        )
        const closeButton = screen.getByRole('button', { name: /close/i })
        expect(closeButton.querySelector('svg')).toBeInTheDocument()
    })

    it('spreads additional props', () => {
        render(
            <Dialog>
                <DialogTrigger id="trigger-id">Trigger</DialogTrigger>
            </Dialog>
        )
        expect(screen.getByText('Trigger')).toHaveAttribute('id', 'trigger-id')
    })

})