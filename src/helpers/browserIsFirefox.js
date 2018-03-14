export default () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Test the UA string for mobile
    return /firefox/i.test(userAgent) && !/Seamonkey/i.test(userAgent);
};
