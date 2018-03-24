import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import List, {
    ListItem,
    ListItemText,
    ListItemIcon,
    ListItemSecondaryAction
} from "material-ui/List";
import Paper from "material-ui/Paper";
import IconButton from "material-ui/IconButton";
import Avatar from "material-ui/Avatar";

import AccountBalanceIcon from "material-ui-icons/AccountBalance";
import PhoneIcon from "material-ui-icons/Phone";
import EmailIcon from "material-ui-icons/Email";
import PersonIcon from "material-ui-icons/Person";
import DeleteIcon from "material-ui-icons/Delete";

import LazyAttachmentImage from "./AttachmentImage/LazyAttachmentImage";
import AccountQRFullscreen from "./QR/AccountQRFullscreen";
import { formatMoney } from "../Helpers/Utils";

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
        const { account } = this.props;
        const formattedBalance = formatMoney(
            account.balance ? account.balance.value : 0
        );

        const accountBalanceText = this.props.hideBalance
            ? "HIDDEN"
            : formattedBalance;

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
                            <IconButton
                                onClick={this.props.toggleDeactivateDialog}
                            >
                                <DeleteIcon />
                            </IconButton>
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

export default AccountCard;
