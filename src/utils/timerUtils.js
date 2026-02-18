export const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

export const formatDuration = (minutes) => {
    if (minutes < 60) {
        return `${minutes}m`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const getTimerMode = (modeName) => {
    const modes = {
        '25/5': { work: 25, break: 5 },
        '50/10': { work: 50, break: 10 },
        '90/20': { work: 90, break: 20 },
    };
    return modes[modeName] || { work: 25, break: 5 };
};

export const calculateProgress = (timeRemaining, totalTime) => {
    return ((totalTime - timeRemaining) / totalTime) * 100;
};
