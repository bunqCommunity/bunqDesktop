export function applicationSetStatus(status_message) {
    return {
        type: "APPLICATION_SET_STATUS_MESSAGE",
        payload: {
            status_message: status_message
        }
    };
}
