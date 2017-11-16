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

export function setHideBalance(hideBalance) {
    return {
        type: "OPTIONS_SET_HIDE_BALANCE",
        payload: {
            hide_balance: hideBalance
        }
    };
}