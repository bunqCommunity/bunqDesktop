export function applicationSetStatus(status_message) {
    return {
        type: "APPLICATION_SET_STATUS_MESSAGE",
        payload: {
            status_message: status_message
        }
    };
}

export function applicationSetOffline() {
    return {
        type: "APPLICATION_SET_OFFLINE"
    };
}

export function applicationSetOnline() {
    return {
        type: "APPLICATION_SET_ONLINE"
    };
}
