export function setTheme(theme) {
    return {
        type: "THEME_SET",
        payload: {
            theme: theme
        }
    };
}
