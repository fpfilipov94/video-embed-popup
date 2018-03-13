export default totalSeconds => {
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor(((totalSeconds % 86400) % 3600) / 60);
    const seconds = Math.round(((totalSeconds % 86400) % 3600) % 60);

    let displayHours = hours.toString();
    let displayMinutes = minutes.toString();
    let displaySeconds = seconds.toString();

    if (hours < 10) {
        displayHours = "0" + displayHours;
    }

    if (minutes < 10) {
        displayMinutes = "0" + displayMinutes;
    }

    if (seconds < 10) {
        displaySeconds = "0" + displaySeconds;
    }

    if (hours <= 0) {
        return `${displayMinutes}:${displaySeconds}`;
    }

    return `${displayHours}:${displayMinutes}:${displaySeconds}`;
};
