import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import Avatar from "@material-ui/core/Avatar";

import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import PhoneIcon from "@material-ui/icons/Phone";
import EmailIcon from "@material-ui/icons/Email";
import PersonIcon from "@material-ui/icons/Person";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import UrlIcon from "@material-ui/icons/Link";

import LazyAttachmentImage from "./AttachmentImage/LazyAttachmentImage";
import AccountQRFullscreen from "./QR/AccountQRFullscreen";
import { formatMoney } from "../Helpers/Utils";
import GetShareDetailBudget from "../Helpers/GetShareDetailBudget";

const styles = {
    avatar: {
        width: 60,
        height: 60
    }
};

class AccountCard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    render() {
        const { account, hideBalance } = this.props;
        let formattedBalance = account.balance ? account.balance.value : 0;

        if (this.props.shareInviteBankResponses.length > 0) {
            const connectBudget = GetShareDetailBudget(
                this.props.shareInviteBankResponses
            );
            if (connectBudget) {
                formattedBalance = connectBudget;
            }
        }

        const accountBalanceText = hideBalance
            ? "HIDDEN"
            : formatMoney(formattedBalance, true);

        return (
            <Paper>
                <List>
                    <ListItem>
                        <Avatar style={styles.avatar}>
                            <LazyAttachmentImage
                                width={60}
                                BunqJSClient={this.props.BunqJSClient}
                                imageUUID={
                                    account.avatar.image[0]
                                        .attachment_public_uuid
                                }
                            />
                        </Avatar>
                        <ListItemText
                            primary={account.description}
                            secondary={accountBalanceText}
                        />
                        <ListItemSecondaryAction>
                            <AccountQRFullscreen accountId={account.id} />

                            {this.props.toggleSettingsDialog ? (
                                <IconButton
                                    onClick={this.props.toggleSettingsDialog}
                                >
                                    <EditIcon />
                                </IconButton>
                            ) : null}

                            {this.props.toggleDeactivateDialog ? (
                                <IconButton
                                    onClick={this.props.toggleDeactivateDialog}
                                >
                                    <DeleteIcon />
                                </IconButton>
                            ) : null}
                        </ListItemSecondaryAction>
                    </ListItem>
                    {account.alias.map(alias => {
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
                                break;
                            case "URL":
                                icon = <UrlIcon />;
                                break;
                        }

                        return (
                            <ListItem button dense={true}>
                                <ListItemIcon>{icon}</ListItemIcon>
                                <CopyToClipboard
                                    text={alias.value}
                                    onCopy={this.copiedValue(alias.type)}
                                >
                                    <ListItemText primary={alias.value} />
                                </CopyToClipboard>
                            </ListItem>
                        );
                    })}
                </List>
            </Paper>
        );
    }
}

AccountCard.defaultProps = {
    toggleDeactivateDialog: false,
    toggleSettingsDialog: false
};

export default AccountCard;
