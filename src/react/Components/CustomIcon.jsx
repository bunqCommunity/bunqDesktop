import React from "react";
import Icon from "@material-ui/core/Icon";

export default ({ children, style = {}, ...props }) => {
    if (children.startsWith("fa")) {
        return <Icon style={{ width: "auto", height: 24, fontSize: 22, ...style }} {...props} className={children} />;
    }

    return (
        <Icon {...props} style={{ width: 24, height: 24, ...style }}>
            {children}
        </Icon>
    );
};
