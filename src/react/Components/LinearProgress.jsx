import React from "react";
import { withTheme } from "@material-ui/core/styles";

const defaultStyle = {
    backgroundProgressBar: {
        position: "relative",
        display: "flex",
        width: "100%",
        height: 8,
        overflow: "hidden"
    },
    valueProgressBarStyle: {
        background: "rgb(183, 221, 251)",
        position: "relative",
        maxWidth: "100%",
        minWidth: 0,
        height: "100%",
        marginLeft: "auto"
    }
};

const LinearProgress = props => {
    const { theme, color = false, backgroundColor = false, style = {}, valueStyle = {}, value } = props;

    let backgroundProgressBarColor = theme.palette.primary.main;
    if (color && theme.palette[color] && theme.palette[color].main) {
        backgroundProgressBarColor = theme.palette[color].main;
    } else if (color) {
        backgroundProgressBarColor = color;
    }

    let valueProgressBarColor = theme.palette.background.default;
    if (backgroundColor && theme.palette[backgroundColor] && theme.palette[backgroundColor].light) {
        valueProgressBarColor = theme.palette[backgroundColor].light;
    } else if (backgroundColor) {
        valueProgressBarColor = backgroundColor;
    }

    const backgroundProgressBarStyle = {
        ...defaultStyle.backgroundProgressBar,
        ...style,
        background: backgroundProgressBarColor
    };
    const valueProgressBarStyle = {
        ...defaultStyle.valueProgressBarStyle,
        ...valueStyle,
        width: `${100 - value}%`,
        background: valueProgressBarColor
    };

    return (
        <div style={backgroundProgressBarStyle}>
            <div style={valueProgressBarStyle} />
        </div>
    );
};

LinearProgress.defaultProps = {
    color: "primary"
};

export default withTheme()(LinearProgress);
