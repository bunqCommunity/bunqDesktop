import React from "react";
import { translate } from "react-i18next";
import {MenuItem} from "material-ui/Menu";

const MenuItemWrapper = ({ t, children, i18n, tReady, ...otherProps }) => {
    return <MenuItem {...otherProps}>{t(children)}</MenuItem>;
};

export default translate("translations")(MenuItemWrapper);
