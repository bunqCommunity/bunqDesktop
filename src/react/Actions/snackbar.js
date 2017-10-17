export function openSnackbar(message, duration = 4000) {
    console.log("open??");
    return {
        type: "SNACKBAR_OPEN",
        payload: {
            message: message,
            duration: duration
        }
    };
}
export function closeSnackbar() {
    return {
        type: "SNACKBAR_CLOSE"
    };
}
