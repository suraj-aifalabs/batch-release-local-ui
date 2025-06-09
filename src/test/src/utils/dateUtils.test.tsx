import { formatDateTime } from '@/utils/dateUtils';

describe('formatDateTime', () => {

    beforeAll(() => {
        jest.spyOn(Intl.DateTimeFormat.prototype, 'resolvedOptions').mockReturnValue({
            locale: 'en-GB',
            calendar: 'gregory',
            numberingSystem: 'latn',
            timeZone: 'UTC'
        });
    });

    afterAll(() => {
        jest.restoreAllMocks();
    });

    it('should return "N/A" for null input', () => {
        expect(formatDateTime(null)).toBe("N/A");
    });

    it('should return "N/A" for undefined input', () => {
        expect(formatDateTime(undefined)).toBe("N/A");
    });

    it('should return "Invalid Date" for non-date strings', () => {
        expect(formatDateTime("not-a-date")).toBe("Invalid Date");
    });

    it('should return formatted date and time for valid ISO string', () => {
        const input = "2024-06-01T14:30:00Z";
        const result = formatDateTime(input);
        // Format: "01-Jun-2024 14:30" in UTC
        expect(result).toMatch(/01-Jun-2024 \d{2}:\d{2}/);
    });

    it('should handle different timezones based on system timezone settings', () => {
        const input = "2024-12-25T10:15:00Z";
        const result = formatDateTime(input);

        expect(result).toMatch(/\d{2}-[A-Za-z]{3}-\d{4} \d{2}:\d{2}/);
    });

    it('should pad day and hour with 0 if single digit', () => {
        const input = "2024-01-05T07:05:00Z";
        const result = formatDateTime(input);

        expect(result).toMatch(/05-Jan-2024 07:05/);
    });
});
