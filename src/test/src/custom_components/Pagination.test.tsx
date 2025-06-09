import { render, screen, fireEvent } from "@testing-library/react";
import Pagination from "@/custom_components/Pagination";
import '@testing-library/jest-dom';

describe("Pagination component", () => {
    const defaultProps = {
        totalPages: 5,
        currentPage: 2,
        itemsPerPage: 10,
        onPageChange: jest.fn(),
        onItemsPerPageChange: jest.fn(),
        rowsPerPageOptions: [5, 10, 25]
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("renders pagination with correct current page and total pages", () => {
        render(
            <Pagination
                totalItems={50}
                currentPage={2}
                itemsPerPage={10}
                onPageChange={jest.fn()}
            />
        );

        expect(
            screen.getByText((content, element) =>
                element?.textContent === "Page 2 of 5"
            )
        ).toBeInTheDocument();
    });

    test("disables previous button on first page", () => {
        render(<Pagination totalItems={1} {...defaultProps} currentPage={1} />);
        const prevBtn = screen.getByRole("button", { name: /previous page/i });
        expect(prevBtn).toBeDisabled();
    });

    test("calls onPageChange with previous page", () => {
        render(<Pagination totalItems={1} {...defaultProps} currentPage={3} />);
        const prevBtn = screen.getByRole("button", { name: /previous page/i });
        fireEvent.click(prevBtn);
        expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
    });


});
