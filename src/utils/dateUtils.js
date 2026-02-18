import { format, formatDistance, differenceInDays, parseISO } from 'date-fns';

export const formatDate = (date) => {
    if (typeof date === 'string') {
        date = parseISO(date);
    }
    return format(date, 'MMM dd, yyyy');
};

export const formatDateShort = (date) => {
    if (typeof date === 'string') {
        date = parseISO(date);
    }
    return format(date, 'MMM dd');
};

export const getDayNumber = (dateString) => {
    const startDate = parseISO('2026-02-18');
    const currentDate = parseISO(dateString);
    return differenceInDays(currentDate, startDate) + 1;
};

export const getDateFromDay = (dayNumber) => {
    const startDate = new Date(2026, 1, 18); // Feb 18, 2026
    const targetDate = new Date(startDate);
    targetDate.setDate(startDate.getDate() + (dayNumber - 1));
    return targetDate.toISOString().split('T')[0];
};

export const getDaysUntilExam = () => {
    const examDate = parseISO('2026-03-21');
    const today = new Date();
    return differenceInDays(examDate, today);
};

export const getRelativeTime = (date) => {
    if (typeof date === 'string') {
        date = parseISO(date);
    }
    return formatDistance(date, new Date(), { addSuffix: true });
};
