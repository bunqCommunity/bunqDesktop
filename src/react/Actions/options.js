export function setTheme(theme) {
    return {
        type: "OPTIONS_SET_THEME",
        payload: {
            theme: theme
        }
    };
}

export function setNativeFrame(useFrame) {
    return {
        type: "OPTIONS_SET_NATIVE_FRAME",
        payload: {
            native_frame: useFrame
        }
    };
}

export function setStickyMenu(stickyMenu) {
    return {
        type: "OPTIONS_SET_STICKY_MENU",
        payload: {
            sticky_menu: stickyMenu
        }
    };
}

export function setHideBalance(hideBalance) {
    return {
        type: "OPTIONS_SET_HIDE_BALANCE",
        payload: {
            hide_balance: hideBalance
        }
    };
}

export function toggleInactivityCheck(checkInactivity) {
    return {
        type: "OPTIONS_SET_CHECK_INACTIVITY",
        payload: {
            check_inactivity: checkInactivity
        }
    };
}

export function setInactivityCheckDuration(inactivityCheckDuration) {
    return {
        type: "OPTIONS_SET_SET_INACTIVITY_DURATION",
        payload: {
            inactivity_check_duration: parseInt(inactivityCheckDuration)
        }
    };
}


export function resetApplication() {
    return {
        type: "OPTIONS_RESET_APPLICATION"
    };
}
