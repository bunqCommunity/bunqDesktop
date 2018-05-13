export function setTheme(theme) {
    return {
        type: "OPTIONS_SET_THEME",
        payload: {
            theme: theme
        }
    };
}

export function setLanguage(language) {
    return {
        type: "OPTIONS_SET_LANGUAGE",
        payload: {
            language: language
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

export function setAnalyticsEnabled(analyticsEnabled) {
    return {
        type: "OPTIONS_SET_ANALYTICS_ENABLED",
        payload: {
            analytics_enabled: analyticsEnabled
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

export function setAutomaticThemeChange(automaticThemeChange) {
    return {
        type: "OPTIONS_SET_AUTOMATIC_THEME_CHANGE",
        payload: {
            automatic_theme_change: automaticThemeChange
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

export function setMinimizeToTray(minimizeToTray) {
    return {
        type: "OPTIONS_SET_HIDE_MINIMIZE_TO_TRAY",
        payload: {
            minimize_to_tray: minimizeToTray
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

export function overwriteSettingsLocation(location) {
    return {
        type: "OPTIONS_OVERWRITE_SETTINGS_LOCATION",
        payload: {
            location: location
        }
    };
}

export function loadSettingsLocation(location) {
    return {
        type: "OPTIONS_LOAD_SETTINGS_LOCATION",
        payload: {
            location: location
        }
    };
}


export function resetApplication() {
    return {
        type: "OPTIONS_RESET_APPLICATION"
    };
}
