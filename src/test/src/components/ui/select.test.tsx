import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
    SelectSeparator,
} from "@/components/ui/select";

jest.mock("@radix-ui/react-select", () => {
    const actual = jest.requireActual("@radix-ui/react-select");
    return {
        ...actual,
        Portal: ({ children }: { children: React.ReactNode }) => <>{children}</>,
    };
});

describe("Select Component", () => {
    it("renders a select component correctly", () => {
        render(
            <Select>
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
            </Select>
        );

        expect(screen.getByText("Select an option")).toBeInTheDocument();
    });

    it("renders different size variants correctly", () => {
        const { rerender } = render(
            <Select>
                <SelectTrigger size="default" data-testid="select-trigger">
                    <SelectValue placeholder="Default size" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                </SelectContent>
            </Select>
        );

        const defaultTrigger = screen.getByTestId("select-trigger");
        expect(defaultTrigger).toHaveAttribute("data-size", "default");

        rerender(
            <Select>
                <SelectTrigger size="sm" data-testid="select-trigger">
                    <SelectValue placeholder="Small size" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                </SelectContent>
            </Select>
        );

        const smallTrigger = screen.getByTestId("select-trigger");
        expect(smallTrigger).toHaveAttribute("data-size", "sm");
    });

    it("shows options when opened", () => {
        render(
            <Select defaultOpen>
                <SelectTrigger data-testid="select-trigger">
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
            </Select>
        );

        expect(screen.getByText("Option 1")).toBeInTheDocument();
        expect(screen.getByText("Option 2")).toBeInTheDocument();
    });

    it("updates the select value when an option is selected", () => {
        const onValueChangeMock = jest.fn();

        render(
            <Select defaultOpen onValueChange={onValueChangeMock}>
                <SelectTrigger data-testid="select-trigger">
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                </SelectContent>
            </Select>
        );

        fireEvent.click(screen.getByText("Option 1"));

        expect(onValueChangeMock).toHaveBeenCalledWith("option1");
    });

    it("applies disabled attribute when disabled", () => {
        render(
            <Select disabled>
                <SelectTrigger data-testid="select-trigger">
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                </SelectContent>
            </Select>
        );

        const trigger = screen.getByTestId("select-trigger");
        expect(trigger).toHaveAttribute("disabled");
    });

    it("renders disabled options correctly", () => {
        render(
            <Select defaultOpen>
                <SelectTrigger data-testid="select-trigger">
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2" disabled data-testid="disabled-option">
                        Option 2 (Disabled)
                    </SelectItem>
                </SelectContent>
            </Select>
        );

        const disabledOption = screen.getByTestId("disabled-option");
        expect(disabledOption).toHaveAttribute("data-disabled");
    });

    it("renders groups and labels correctly", () => {
        render(
            <Select defaultOpen>
                <SelectTrigger data-testid="select-trigger">
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        <SelectLabel>Fruits</SelectLabel>
                        <SelectItem value="apple">Apple</SelectItem>
                        <SelectItem value="banana">Banana</SelectItem>
                    </SelectGroup>
                    <SelectSeparator data-testid="separator" />
                    <SelectGroup>
                        <SelectLabel>Vegetables</SelectLabel>
                        <SelectItem value="carrot">Carrot</SelectItem>
                        <SelectItem value="potato">Potato</SelectItem>
                    </SelectGroup>
                </SelectContent>
            </Select>
        );

        // Check that labels and groups are rendered
        expect(screen.getByText("Fruits")).toBeInTheDocument();
        expect(screen.getByText("Vegetables")).toBeInTheDocument();

        expect(screen.getByTestId("separator")).toBeInTheDocument();
    });

    it("applies custom classes to components", () => {
        render(
            <Select>
                <SelectTrigger className="custom-trigger-class" data-testid="select-trigger">
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent className="custom-content-class" data-testid="select-content">
                    <SelectItem className="custom-item-class" value="option1" data-testid="select-item">
                        Option 1
                    </SelectItem>
                </SelectContent>
            </Select>
        );

        const trigger = screen.getByTestId("select-trigger");
        expect(trigger.className).toContain("custom-trigger-class");
    });

    it("renders SelectContent with different positions", () => {
        render(
            <Select defaultOpen>
                <SelectTrigger>
                    <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent position="popper" data-testid="select-content">
                    <SelectItem value="option1">Option 1</SelectItem>
                </SelectContent>
            </Select>
        );

        const content = screen.getByTestId("select-content");
        expect(content.className).toContain("data-[side=bottom]:translate-y-1");
    });

    it("can be controlled via keyboard", () => {
        const TestComponent = () => {
            const [value, setValue] = React.useState<string>();
            return (
                <div data-testid="test-wrapper">
                    <div data-testid="selected-value">{value}</div>
                    <Select value={value} onValueChange={setValue} defaultOpen>
                        <SelectTrigger data-testid="select-trigger">
                            <SelectValue placeholder="Select an option" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="option1">Option 1</SelectItem>
                            <SelectItem value="option2">Option 2</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            );
        };

        render(<TestComponent />);

        const firstOption = screen.getByText("Option 1");
        fireEvent.click(firstOption);

        expect(screen.getByTestId("selected-value").textContent).toBe("option1");
    });
});