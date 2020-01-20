import React from "react";
import { translate } from "react-i18next";
import Button from "@material-ui/core/Button";

const ButtonWrapper = ({ t, children, i18n, tReady, variant = "text", ...otherProps }) => {
    return (
        <Button variant={variant} {...otherProps}>
            {t(children)}
        </Button>
    );
};

export default translate("translations")(ButtonWrapper);
