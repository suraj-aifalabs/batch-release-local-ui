import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import { CustomInput } from '@/custom_components/CustomInput';
import '@testing-library/jest-dom';

jest.mock('@/custom_components/CustomLabel.tsx', () => ({
    CustomLabel: ({ labelName, htmlFor, className }: { labelName: string; htmlFor: string; className?: string }) => (
        <label htmlFor={htmlFor} className={className}>
            {labelName}
        </label>
    ),
}));

import type { FieldErrors } from 'react-hook-form';

interface FormWrapperProps {
    children: ((props: { register: ReturnType<typeof useForm>['register']; errors: FieldErrors<Record<string, unknown>> }) => React.ReactNode) | React.ReactNode;
    defaultValues: Record<string, unknown>;
    validationRules: Record<string, Record<string, unknown>>;
}

export const FormWrapper: React.FC<FormWrapperProps> = ({
    children,
    defaultValues = {},
    validationRules = {},
}) => {
    const { register, formState: { errors }, handleSubmit } = useForm({ defaultValues });
    return (
        <form aria-label="test-form" onSubmit={handleSubmit(() => { })}>
            {typeof children === 'function'
                ? children({ register: ((id: string) => register(id, validationRules[id])) as ReturnType<typeof useForm>['register'], errors })
                : React.isValidElement(children) && typeof children.type !== 'string'
                    ? React.cloneElement(children as React.ReactElement<{ register: ReturnType<typeof useForm>['register']; errors: FieldErrors<Record<string, unknown>> }>, {
                        register: ((id: string) => register(id as string, validationRules[id])) as ReturnType<typeof useForm>['register'],
                        errors,
                    })
                    : children}
        </form>
    );
};

describe('CustomInput Component', () => {
    test('renders input with default props', () => {
        render(<CustomInput id="test-input" />);
        const input = screen.getByRole('textbox');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('id', 'test-input');
        expect(input).toHaveAttribute('type', 'text');
        expect(screen.getByText('Label Name')).toBeInTheDocument();
    });

    test('renders custom label when showLabel is true', () => {
        render(<CustomInput id="test-input" labelName="Username" />);
        expect(screen.getByText('Username')).toBeInTheDocument();
    });

    test('does not render label when showLabel is false', () => {
        render(<CustomInput id="test-input" showLabel={false} />);
        expect(screen.queryByText('Label Name')).not.toBeInTheDocument();
    });

    test('renders input with specified type', () => {
        render(<CustomInput id="test-input" inputType="email" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveAttribute('type', 'email');
    });

    test('renders input with placeholder', () => {
        render(<CustomInput id="test-input" placeholder="Enter text" />);
        const input = screen.getByPlaceholderText('Enter text');
        expect(input).toBeInTheDocument();
    });

    test('handles input value changes', async () => {
        const handleChange = jest.fn();
        render(<CustomInput id="test-input" onChange={handleChange} />);
        const input = screen.getByRole('textbox');
        await act(async () => {
            fireEvent.change(input, { target: { value: 'test' } });
        });
        expect(handleChange).toHaveBeenCalled();
        expect(input).toHaveValue('test');
    });

    test('toggles password visibility', async () => {
        render(<CustomInput id="password-input" inputType="password" />);
        const input = screen.getByTestId('password-input');
        const toggleButton = screen.getByTestId('toggle-password');

        expect(input).toHaveAttribute('type', 'password');
        await act(async () => {
            fireEvent.click(toggleButton);
        });
        expect(input).toHaveAttribute('type', 'text');
        await act(async () => {
            fireEvent.click(toggleButton);
        });
        expect(input).toHaveAttribute('type', 'password');
    });

    test('displays search icon for search input', () => {
        render(<CustomInput id="search-input" inputType="search" />);
        const searchIcon = screen.getByTestId('search-icon');
        expect(searchIcon).toBeInTheDocument();
    });

    test('displays error message when errors are provided', async () => {
        render(
            <FormWrapper
                defaultValues={{ 'test-input': '' }}
                validationRules={{ 'test-input': { required: 'This field is required' } }}
            >
                <CustomInput id="test-input" />
            </FormWrapper>
        );

        await act(async () => {
            fireEvent.submit(screen.getByRole('form', { name: /test-form/i }));
        });
        await waitFor(() => {
            expect(screen.getByText('This field is required')).toHaveClass('text-red-600');
        });
    });

    test('displays custom message when no errors', () => {
        render(<CustomInput id="test-input" customMessage="Looks good!" />);
        expect(screen.getByText('Looks good!')).toHaveClass('text-green-600');
    });

    test('does not display custom message when errors exist', async () => {
        render(
            <FormWrapper
                defaultValues={{ 'test-input': '' }}
                validationRules={{ 'test-input': { required: 'This field is required' } }}
            >
                <CustomInput id="test-input" customMessage="Looks good!" />
            </FormWrapper>
        );
        await act(async () => {
            fireEvent.submit(screen.getByRole('form', { name: /test-form/i }));
        });
        await waitFor(() => {
            expect(screen.queryByText('Looks good!')).not.toBeInTheDocument();
        });
    });

    test('displays info icon and tooltip when showInfo is true', async () => {
        render(<CustomInput id="test-input" showInfo={true} infoMessage="Tooltip info" />);
        const infoIcon = screen.getByTestId('info-icon');
        expect(infoIcon).toBeInTheDocument();

        await act(async () => {
            fireEvent.mouseOver(infoIcon.closest('.group')!);
        });
        await waitFor(() => {
            const tooltip = screen.getByText('Tooltip info');
            expect(tooltip).toBeInTheDocument();
        });
    });

    test('does not display info tooltip when showInfo is false', () => {
        render(<CustomInput id="test-input" showInfo={false} infoMessage="Tooltip info" />);
        expect(screen.queryByText('Tooltip info')).not.toBeInTheDocument();
    });

    test('applies custom className to input', () => {
        render(<CustomInput id="test-input" className="custom-class" />);
        const input = screen.getByRole('textbox');
        expect(input).toHaveClass('custom-class');
    });

    test('works with react-hook-form', async () => {
        const onSubmit = jest.fn();
        const Wrapper = () => {
            const { register, handleSubmit, formState: { errors } } = useForm();
            return (
                <form onSubmit={handleSubmit(onSubmit)} aria-label="test-form">
                    <CustomInput id="test-input" register={register} errors={errors as Record<string, import('react-hook-form').FieldError>} />
                    <button type="submit">Submit</button>
                </form>
            );
        };
        render(<Wrapper />);
        const input = screen.getByRole('textbox');
        await act(async () => {
            fireEvent.change(input, { target: { value: 'test' } });
        });
        expect(input).toHaveValue('test');
        await act(async () => {
            fireEvent.click(screen.getByRole('button', { name: /submit/i }));
        });
        await waitFor(() => {
            expect(onSubmit).toHaveBeenCalled();
        });
    });
});