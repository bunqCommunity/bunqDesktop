import React from "react";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";

import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import PersonIcon from "@material-ui/icons/Person";
import UrlIcon from "@material-ui/icons/Link";

import { formatIban } from "../Functions/Utils";
import CopyToClipboardWrap from "../Components/CopyToClipboardWrap";

export default ({ aliasses, copiedValue = () => {} }) => {
    return aliasses.map(alias => {
        let value = alias.value;
        let icon = <PersonIcon />;
        switch (alias.type) {
            case "EMAIL":
                icon = <EmailIcon />;
                break;
            case "PHONE_NUMBER":
                icon = <PhoneIcon />;
                break;
            case "IBAN":
                icon = <AccountBalanceIcon />;
                value = formatIban(alias.value);
                break;
            case "URL":
                icon = <UrlIcon />;
                break;
        }

        return (
            <ListItem button dense={true}>
                <ListItemIcon>{icon}</ListItemIcon>
                <CopyToClipboardWrap text={alias.value} onCopy={copiedValue(alias.type)}>
                    <ListItemText primary={value} />
                </CopyToClipboardWrap>
            </ListItem>
        );
    });
};
