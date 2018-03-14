export default () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Test the UA string for mobile
    return (
        /windows phone/i.test(userAgent) ||
        /android/i.test(userAgent) ||
        (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream)
    );
};
