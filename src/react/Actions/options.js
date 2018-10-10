export function setGenericOption(setting, value) {
    return {
        type: "OPTIONS_SET_GENERIC",
        payload: {
            setting: setting,
            value: value
        }
    };
}

export function setSyncOnStartup(syncOnStartup) {
    return setGenericOption("sync_on_startup", syncOnStartup);
}

export function setTheme(theme) {
    return setGenericOption("theme", theme);
}

export function setLanguage(language) {
    return setGenericOption("language", language);
}

export function setNativeFrame(useFrame) {
    return setGenericOption("native_frame", useFrame);
}

export function setAnalyticsEnabled(analyticsEnabled) {
    return setGenericOption("analytics_enabled", analyticsEnabled);
}

export function setStickyMenu(stickyMenu) {
    return setGenericOption("sticky_menu", stickyMenu);
}

export function setAutomaticThemeChange(automaticThemeChange) {
    return setGenericOption("automatic_theme_change", automaticThemeChange);
}

export function setHideBalance(hideBalance) {
    return setGenericOption("hide_balance", hideBalance);
}

export function setMinimizeToTray(minimizeToTray) {
    return setGenericOption("minimize_to_tray", minimizeToTray);
}

export function toggleInactivityCheck(checkInactivity) {
    return setGenericOption("check_inactivity", checkInactivity);
}

export function setInactivityCheckDuration(inactivityCheckDuration) {
    return setGenericOption("inactivity_check_duration", inactivityCheckDuration);
}

export function toggleAutomaticUpdatesEnabled(updateAutomatically) {
    return setGenericOption("automatic_update_enabled", updateAutomatically);
}

export function toggleAutomaticUpdatesSendNotification(sendNotification) {
    return setGenericOption("automatic_update_send_notification", sendNotification);
}

export function setAutomaticUpdateDuration(automaticUpdateDuration) {
    return setGenericOption("automatic_update_duration", automaticUpdateDuration);
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
