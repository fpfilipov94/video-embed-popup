const MONTHS = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

export default date => {
    if (typeof date === "string") {
        date = new Date(date);
    }

    const month = MONTHS[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const minutes = date.getMinutes();
    let hour = date.getHours();

    let dayTime = "AM";

    if (hour > 12) {
        dayTime = "PM";
        hour -= 12;
    }

    let displayMinutes = minutes < 10 ? "0" + minutes : minutes.toString();

    return `${month} ${day}, ${year} AT ${hour}:${displayMinutes} ${dayTime}`;
};
