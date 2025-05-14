export const formatDateTime = (dateString: string | null | undefined): string => {
    if (!dateString) {
        return "N/A";
    }

    const date = new Date(dateString);

    // Check if the date is invalid
    if (isNaN(date.getTime())) {
        return "Invalid Date";
    }

    const dateOptions: Intl.DateTimeFormatOptions = {
        day: "2-digit",
        month: "short",
        year: "numeric",
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    const timeOptions: Intl.DateTimeFormatOptions = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    // Format date and time separately, then combine
    const formattedDate = date.toLocaleDateString("en-GB", dateOptions).replace(/\s/g, "-");
    const formattedTime = date.toLocaleTimeString("en-GB", timeOptions);

    return `${formattedDate} ${formattedTime}`;
};