import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "@/components/ui/checkbox";

describe("Checkbox", () => {
    it("renders correctly", () => {
        render(<Checkbox aria-label="Accept terms" />);
        expect(screen.getByRole("checkbox")).toBeInTheDocument();
    });

    it("applies the correct className", () => {
        render(<Checkbox className="test-class" aria-label="Accept terms" />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveClass("test-class");
        expect(checkbox).toHaveClass("peer");
        expect(checkbox).toHaveClass("border-input");
    });

    it("handles checked state", () => {
        render(<Checkbox aria-label="Accept terms" />);
        const checkbox = screen.getByRole("checkbox");

        // Initial state should be unchecked
        expect(checkbox).not.toHaveAttribute("data-state", "checked");

        // Click to check
        fireEvent.click(checkbox);
        expect(checkbox).toHaveAttribute("data-state", "checked");

        // Click again to uncheck
        fireEvent.click(checkbox);
        expect(checkbox).not.toHaveAttribute("data-state", "checked");
    });

    it("applies controlled state correctly", () => {
        const onCheckedChange = jest.fn();
        const { rerender } = render(
            <Checkbox aria-label="Accept terms" checked={true} onCheckedChange={onCheckedChange} />
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("data-state", "checked");

        rerender(<Checkbox aria-label="Accept terms" checked={false} onCheckedChange={onCheckedChange} />);
        expect(checkbox).not.toHaveAttribute("data-state", "checked");
    });

    it("handles the disabled state", () => {
        render(<Checkbox aria-label="Accept terms" disabled />);
        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toBeDisabled();
        expect(checkbox).toHaveClass("disabled:cursor-not-allowed");
    });

    it("handles onClick event", () => {
        const handleClick = jest.fn();
        render(<Checkbox aria-label="Accept terms" onClick={handleClick} />);
        const checkbox = screen.getByRole("checkbox");

        fireEvent.click(checkbox);
        expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it("forwards ref to the underlying element", () => {
        const ref = React.createRef<HTMLButtonElement>();
        render(<Checkbox aria-label="Accept terms" ref={ref} />);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });

    it("shows the indicator when checked", () => {
        render(<Checkbox aria-label="Accept terms" defaultChecked />);
        const indicator = screen.getByRole("checkbox").querySelector('[data-slot="checkbox-indicator"]');
        expect(indicator).toBeInTheDocument();
        expect(indicator).toBeVisible();
    });

    it("associates with label correctly", () => {
        render(
            <>
                <label htmlFor="test-checkbox">Test Label</label>
                <Checkbox id="test-checkbox" />
            </>
        );

        const label = screen.getByText("Test Label");
        fireEvent.click(label);

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("data-state", "checked");
    });

    it("handles complex children in the indicator", () => {
        render(
            <Checkbox aria-label="Custom checkbox" defaultChecked>
                <div data-testid="custom-indicator">Custom indicator</div>
            </Checkbox>
        );

        const checkbox = screen.getByRole("checkbox");
        expect(checkbox).toHaveAttribute("data-state", "checked");
    });
});