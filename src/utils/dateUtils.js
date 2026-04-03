import {
    format,
    formatDistance,
    differenceInDays,
    differenceInCalendarDays,
    parseISO,
    startOfDay,
} from 'date-fns';
import { getUpcomingComputedDates } from './gateExamDates';

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

/** Days until GATE CSE (1st Sunday of Feb in current cycle). Uses same formula as the nav countdown (sync). */
export const getDaysUntilExam = () => {
    const { gateCse } = getUpcomingComputedDates();
    return differenceInCalendarDays(startOfDay(gateCse), startOfDay(new Date()));
};

export const getRelativeTime = (date) => {
    if (typeof date === 'string') {
        date = parseISO(date);
    }
    return formatDistance(date, new Date(), { addSuffix: true });
};
