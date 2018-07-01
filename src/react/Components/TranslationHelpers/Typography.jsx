import React from "react";
import { translate } from "react-i18next";
import Typography from "@material-ui/core/Typography";

const TypographyWrapper = ({ t, children, i18n, tReady, ...otherProps }) => {
    return <Typography {...otherProps}>{t(children)}</Typography>;
};

export default translate("translations")(TypographyWrapper);
