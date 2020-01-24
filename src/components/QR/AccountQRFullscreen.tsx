import React from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import IconButton from "@material-ui/core/IconButton";
import Slide from "@material-ui/core/Slide";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import { ReduxState } from "~store/index";

const Transition = props => <Slide direction={"up"} {...props} />;

import AccountQRCode from "./AccountQRCode";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import QRSvg from "./QRSvg";
import QRCode from "./QRCode";

import { formatIban } from "~functions/Utils";

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
    },
    dialogContentWrapper: {
        width: 250,
        display: "flex",
        alignItems: "center",
        flexDirection: "column"
    }
});

interface IState {
    open: boolean;
}

interface IProps {
    [key: string]: any;
}

class AccountQRFullscreen extends React.PureComponent<ReturnType<typeof mapStateToProps> & IProps> {
    static defaultProps = {
        accountId: false,
        mode: "ACCOUNT"
    };

    state: IState = {
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

        let dialogContent = null;
        switch (this.props.mode) {
            case "ACCOUNT":
                const accountId = this.props.accountId !== false ? this.props.accountId : this.props.selectedAccount;

                let accountInfo = false;
                let IBAN = "";
                accounts.map(account => {
                    if (account.id === accountId) {
                        accountInfo = account;
                    }
                });
                // @ts-ignore
                accountInfo.alias.map(alias => {
                    if (alias.type === "IBAN") {
                        IBAN = alias.value;
                    }
                });

                dialogContent = (
                    <>
                        <AccountQRCode accountId={this.props.accountId} size={250} />
                        <ListItem className={classes.listItem}>
                            <Avatar className={classes.bigAvatar}>
                                <LazyAttachmentImage
                                    height={45}
                                    imageUUID={
                                        // @ts-ignore
                                        accountInfo.avatar.image[0].attachment_public_uuid
                                    }
                                />
                            </Avatar>
                            <ListItemText primary={
                                // @ts-ignore
                                accountInfo.description
                            } secondary={formatIban(IBAN)} />
                        </ListItem>
                    </>
                );
                break;
            case "TEXT":
                dialogContent = (
                    <>
                        <QRCode value={this.props.text} size={250} />
                        <ListItem className={classes.listItem} dense>
                            <ListItemText primary={this.props.text} />
                        </ListItem>
                    </>
                );
                break;
            case "HIDDEN":
                dialogContent = (
                    <>
                        <QRCode value={this.props.text} size={250} />
                    </>
                );
                break;
        }

        return (
            <>
                <IconButton onClick={this.handleClickOpen}>
                    <QRSvg />
                </IconButton>
                <Dialog
                    fullScreen
                    className={classes.dialog}
                    open={this.state.open}
                    onClose={this.handleRequestClose}
                    onClick={this.handleRequestClose}
                    TransitionComponent={Transition}
                >
                    <div className={classes.content}>
                        <div className={classes.dialogContentWrapper}>{dialogContent}</div>
                    </div>
                </Dialog>
            </>
        );
    }
}

const mapStateToProps = (state: ReduxState) => {
    return {
        accounts: state.accounts.accounts,
        selectedAccount: state.accounts.selectedAccount
    };
};

// @ts-ignore
export default withStyles(styles)(connect(mapStateToProps)(AccountQRFullscreen));
