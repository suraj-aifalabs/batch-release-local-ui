import { render, screen, fireEvent } from '@testing-library/react';
import { Button, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

describe('Button Component', () => {
    it('renders with default variant and size', () => {
        render(<Button>Click Me</Button>);
        const button = screen.getByRole('button');

        expect(button).toBeInTheDocument();
        expect(button).toHaveClass(
            cn(buttonVariants({ variant: 'default', size: 'default' }))
        );
    });

    it.each([
        ['default', 'bg-primary text-primary-foreground'],
        ['destructive', 'bg-destructive text-white'],
        ['outline', 'border bg-background'],
        ['secondary', 'bg-secondary text-secondary-foreground'],
        ['ghost', 'hover:bg-accent hover:text-accent-foreground'],
        ['link', 'text-primary underline-offset-4']
    ] as const)(
        'applies %s variant correctly',
        (variant: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link', expectedClass) => {
            render(<Button variant={variant}>{variant} Button</Button>);
            expect(screen.getByRole('button')).toHaveClass(expectedClass);
        }
    );

    it.each([
        ['default', 'h-9 px-4 py-2'],
        ['sm', 'h-8 px-3'],
        ['lg', 'h-10 px-6'],
        ['icon', 'size-9']
    ] as ['default' | 'sm' | 'lg' | 'icon', string][])('applies %s size correctly', (size, expectedClass) => {
        render(<Button size={size}>{size} Button</Button>);
        expect(screen.getByRole('button')).toHaveClass(expectedClass);
    });

    it('renders as child element when asChild=true', () => {
        render(
            <Button asChild>
                <a href="#">Link Button</a>
            </Button>
        );

        expect(screen.queryByRole('button')).toBeNull();
        const link = screen.getByRole('link');
        expect(link).toBeInTheDocument();
        expect(link).toHaveClass(buttonVariants());
    });

    it('triggers onClick handler', () => {
        const handleClick = jest.fn();
        render(<Button onClick={handleClick}>Clickable</Button>);

        fireEvent.click(screen.getByRole('button'));
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('is disabled when disabled prop is true', () => {
        render(<Button disabled>Disabled</Button>);

        const button = screen.getByRole('button');
        expect(button).toBeDisabled();
        expect(button).toHaveClass('disabled:opacity-50');
    });

    it('applies focus-visible styles', () => {
        render(<Button>Focusable</Button>);
        const button = screen.getByRole('button');

        fireEvent.focus(button);
        expect(button).toHaveClass('focus-visible:ring-[3px]');
    });

    it('applies invalid state styles', () => {
        render(<Button aria-invalid="true">Invalid</Button>);
        expect(screen.getByRole('button')).toHaveClass('aria-invalid:border-destructive');
    });
});