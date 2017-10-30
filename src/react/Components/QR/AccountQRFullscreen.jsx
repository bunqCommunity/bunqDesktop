import React from "react";
import { connect } from "react-redux";
import Dialog from "material-ui/Dialog";
import IconButton from "material-ui/IconButton";
import Slide from "material-ui/transitions/Slide";
import { ListItem, ListItemText } from "material-ui/List";
import Avatar from "material-ui/Avatar";

import AccountQRCode from "./AccountQRCode";
import AttachmentImage from "../AttachmentImage";

const styles = {
    btnIcon: {
        width: 32,
        height: 32
    },
    dialog: {
        marginTop: 50
    },
    listItem: {
        paddingLeft: 0,
        paddingRight: 0
    },
    bigAvatar: {
        width: 45,
        height: 45
    },
    content: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
};

class AccountQRFullscreen extends React.PureComponent {
    state = {
        open: false
    };

    handleClickOpen = () => {
        this.setState({ open: true });
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { accounts } = this.props;

        const accountId =
            this.props.accountId !== false
                ? this.props.accountId
                : this.props.selectedAccount;

        let accountInfo = false;
        let IBAN = "";
        accounts.map(account => {
            if (account.MonetaryAccountBank.id === accountId) {
                accountInfo = account.MonetaryAccountBank;
            }
        });
        accountInfo.alias.map(alias => {
            if (alias.type === "IBAN") {
                IBAN = alias.value;
            }
        });

        return [
            <IconButton onClick={this.handleClickOpen}>
                <img style={styles.btnIcon} src="./images/qr.svg" />
            </IconButton>,
            <Dialog
                fullScreen
                style={styles.dialog}
                open={this.state.open}
                onRequestClose={this.handleRequestClose}
                onClick={this.handleRequestClose}
                onEscapeKeyUp={this.handleRequestClose}
                onBackdropClick={this.handleRequestClose}
                transition={<Slide direction="up" />}
            >
                <div style={styles.content}>
                    <div style={{ width: 195 }}>
                        <AccountQRCode accountId={this.props.accountId} />
                        <ListItem style={styles.listItem}>
                            <Avatar style={styles.bigAvatar}>
                                <AttachmentImage
                                    width={45}
                                    BunqJSClient={this.props.BunqJSClient}
                                    imageUUID={
                                        accountInfo.avatar.image[0]
                                            .attachment_public_uuid
                                    }
                                />
                            </Avatar>
                            <ListItemText
                                primary={accountInfo.description}
                                secondary={IBAN}
                            />
                        </ListItem>
                    </div>
                </div>
            </Dialog>
        ];
    }
}

AccountQRFullscreen.defaultProps = {
    accountId: false
};

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,
        selectedAccount: state.accounts.selectedAccount
    };
};

export default connect(mapStateToProps)(AccountQRFullscreen);
