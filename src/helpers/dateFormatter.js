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

    return `${month} ${day}, ${year} AT ${hour}:${minutes} ${dayTime}`;
};
