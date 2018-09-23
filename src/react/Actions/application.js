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

export function applicationSetLastAutoUpdate() {
    return {
        type: "APPLICATION_SET_LAST_AUTO_UPDATE"
    };
}

export function applicationForceUpdate() {
    return {
        type: "APPLICATION_FORCE_UPDATE"
    };
}

export function applicationSetPDFMode(enabled = false) {
    return {
        type: "APPLICATION_SET_PDF_MODE",
        payload: {
            enabled: enabled
        }
    };
}
