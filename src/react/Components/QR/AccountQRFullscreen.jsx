import React from "react";
import { connect } from "react-redux";
import { withStyles } from "material-ui/styles";
import Dialog from "material-ui/Dialog";
import IconButton from "material-ui/IconButton";
import Slide from "material-ui/transitions/Slide";
import { ListItem, ListItemText } from "material-ui/List";
import Avatar from "material-ui/Avatar";

const Transition = props => <Slide direction={"up"} {...props} />;

import AccountQRCode from "./AccountQRCode";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import QRSvg from "./QRSvg";

const styles = theme => ({
    btnIcon: {
        color: theme.palette.text.secondary,
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
});

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
        const { accounts, theme, classes } = this.props;

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
                <QRSvg />
            </IconButton>,
            <Dialog
                fullScreen
                className={classes.dialog}
                open={this.state.open}
                onRequestClose={this.handleRequestClose}
                onClick={this.handleRequestClose}
                onEscapeKeyUp={this.handleRequestClose}
                onBackdropClick={this.handleRequestClose}
                transition={Transition}
            >
                <div className={classes.content}>
                    <div style={{ width: 195 }}>
                        <AccountQRCode accountId={this.props.accountId} />
                        <ListItem className={classes.listItem}>
                            <Avatar className={classes.bigAvatar}>
                                <LazyAttachmentImage
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

export default withStyles(styles)(
    connect(mapStateToProps)(AccountQRFullscreen)
);
