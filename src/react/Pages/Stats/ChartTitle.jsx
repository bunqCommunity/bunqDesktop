import React from "react";
import Typography from "@material-ui/core/Typography";

export default ({ children, t, ...rest }) => {
    return (
        <Typography variant="h6" style={{ textAlign: "center", padding: 8 }} {...rest}>
            {t(children)}
        </Typography>
    );
};
