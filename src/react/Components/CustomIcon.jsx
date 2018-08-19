import React from "react";
import Icon from "@material-ui/core/Icon";

export default ({ children, style = {}, ...props }) => {
    if (children.startsWith("fa")) {
        return (
            <Icon
                style={{ ...style, width: 24, height: 24, fontSize: 22 }}
                {...props}
                className={children}
            />
        );
    }

    return (
        <Icon {...props} style={style}>
            {children}
        </Icon>
    );
};
