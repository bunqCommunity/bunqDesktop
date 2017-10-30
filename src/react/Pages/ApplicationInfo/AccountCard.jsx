import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import List, {
    ListItem,
    ListItemText,
    ListItemAvatar,
    ListItemSecondaryAction
} from "material-ui/List";
import Paper from "material-ui/Paper";
import Avatar from "material-ui/Avatar";
import AccountBalanceIcon from "material-ui-icons/AccountBalance";

import AttachmentImage from "../../Components/AttachmentImage";
import AccountQRFullscreen from "../../Components/QR/AccountQRFullscreen";
import { formatMoney } from "../../Helpers/Utils";

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

        const formattedBalance = formatMoney(account.balance.value);
        let IBAN = "";
        account.alias.map(alias => {
            if (alias.type === "IBAN") {
                IBAN = alias.value;
            }
        });
        return (
            <Paper>
                <List>
                    <ListItem>
                        <Avatar style={styles.avatar}>
                            <AttachmentImage
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
                            secondary={formattedBalance}
                        />
                        <ListItemSecondaryAction>
                            <AccountQRFullscreen accountId={account.id} />
                        </ListItemSecondaryAction>
                    </ListItem>
                </List>
                <List dense={true}>
                    <ListItem button>
                        <ListItemAvatar>
                            <AccountBalanceIcon />
                        </ListItemAvatar>
                        <CopyToClipboard
                            text={IBAN}
                            onCopy={this.copiedValue("IBAN")}
                        >
                            <ListItemText primary={IBAN} />
                        </CopyToClipboard>
                    </ListItem>
                </List>
            </Paper>
        );
    }
}

export default AccountCard;
