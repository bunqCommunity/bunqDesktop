import React from "react";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";

import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import PersonIcon from "@material-ui/icons/Person";

const styles = {
    chip: {
        margin: 5
    }
};

const TargetChip = ({ target, targetKey, accounts, onClick = false, onDelete = false, style = {} }) => {
    let Icon = null;
    let targetValue = target.value;
    switch (target.type) {
        case "EMAIL":
        case "PHONE":
        case "CONTACT":
            Icon = PersonIcon;
            break;
        case "TRANSFER":
            // for transfers we can try to display a description
            if (accounts[target.value]) {
                targetValue = accounts[target.value].description;
            }
            Icon = CompareArrowsIcon;
            break;
        default:
        case "IBAN":
            Icon = AccountBalanceIcon;
            break;
    }

    const chipProps = {};
    if (onDelete) chipProps.onDelete = e => onDelete(targetKey);
    if (onClick) chipProps.onDelete = e => onClick(targetKey);

    return (
        <Chip
            key={targetKey}
            label={targetValue}
            style={{
                ...styles.chip,
                ...style
            }}
            avatar={
                <Avatar>
                    <Icon color="primary" />
                </Avatar>
            }
            {...chipProps}
        />
    );
};

export default TargetChip;
