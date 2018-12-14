import React from "react";
import { connect } from "react-redux";
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
import LinkIcon from "@material-ui/icons/Link";
import PeopleIcon from "@material-ui/icons/People";

import UploadFullscreen from "./FileUpload/UploadFullscreen";
import LazyAttachmentImage from "./AttachmentImage/LazyAttachmentImage";
import AccountQRFullscreen from "./QR/AccountQRFullscreen";

import { formatMoney, formatIban } from "../Functions/Utils";
import { connectGetBudget } from "../Functions/ConnectGetPermissions";
import { openSnackbar } from "../Actions/snackbar";
import { accountsUpdateImage } from "../Actions/accounts";

const styles = {
    avatar: {
        width: 60,
        height: 60
    },
    secondaryIcon: {
        width: 26,
        height: 26,
        color: "#ffffff",
        backgroundColor: "#ffa500"
    }
};

class AccountCard extends React.Component {
    constructor(props, context) {
        super(props, context);

        this.state = {
            displayUploadScreen: false
        };
    }

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    handleFileUpload = fileUUID => {
        const { user, account } = this.props;
        this.toggleFileUploadDialog();

        if (fileUUID) {
            this.props.accountsUpdateImage(user.id, account.id, fileUUID, account.accountType);
        }
    };

    toggleFileUploadDialog = () => {
        this.setState({
            displayUploadScreen: !this.state.displayUploadScreen
        });
    };

    render() {
        const { account, hideBalance, shareInviteBankResponses } = this.props;
        let formattedBalance = account.balance ? account.balance.value : 0;

        if (this.props.shareInviteBankResponses.length > 0) {
            const connectBudget = connectGetBudget(this.props.shareInviteBankResponses);
            if (connectBudget) formattedBalance = connectBudget;
        }

        let avatarSub = null;
        if (this.props.isJointAccount) {
            avatarSub = (
                <Avatar style={styles.secondaryIcon}>
                    <PeopleIcon />
                </Avatar>
            );
        } else if (this.props.shareInviteBankResponses.length > 0) {
            avatarSub = (
                <Avatar style={styles.secondaryIcon}>
                    <LinkIcon />
                </Avatar>
            );
        }

        const accountBalanceText = hideBalance ? "HIDDEN" : formatMoney(formattedBalance, true);

        return (
            <Paper>
                <UploadFullscreen
                    BunqJSClient={this.props.BunqJSClient}
                    open={this.state.displayUploadScreen}
                    onComplete={this.handleFileUpload}
                    onClose={this.toggleFileUploadDialog}
                />
                <List>
                    <ListItem>
                        <Avatar
                            style={
                                shareInviteBankResponses.length > 0
                                    ? styles.avatar
                                    : { ...styles.avatar, cursor: "pointer" }
                            }
                            onClick={
                                shareInviteBankResponses.length > 0
                                    ? () => {}
                                    : _ =>
                                          this.setState({
                                              displayUploadScreen: true
                                          })
                            }
                        >
                            <LazyAttachmentImage
                                BunqJSClient={this.props.BunqJSClient}
                                height={60}
                                imageUUID={account.avatar.image[0].attachment_public_uuid}
                                style={shareInviteBankResponses.length > 0 ? {} : { cursor: "pointer" }}
                            />
                        </Avatar>
                        <div
                            style={{
                                position: "absolute",
                                left: 60,
                                bottom: 4
                            }}
                        >
                            {avatarSub}
                        </div>
                        <ListItemText primary={account.description} secondary={accountBalanceText} />
                        <ListItemSecondaryAction>
                            <AccountQRFullscreen accountId={account.id} />

                            {this.props.toggleSettingsDialog ? (
                                <IconButton onClick={this.props.toggleSettingsDialog}>
                                    <EditIcon />
                                </IconButton>
                            ) : null}

                            {this.props.toggleDeactivateDialog ? (
                                <IconButton onClick={this.props.toggleDeactivateDialog}>
                                    <DeleteIcon />
                                </IconButton>
                            ) : null}
                        </ListItemSecondaryAction>
                    </ListItem>
                    {account.alias.map(alias => {
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
                                <CopyToClipboard text={alias.value} onCopy={this.copiedValue(alias.type)}>
                                    <ListItemText primary={value} />
                                </CopyToClipboard>
                            </ListItem>
                        );
                    })}
                </List>
            </Paper>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        accountsUpdateImage: (userId, accountId, attachmentId, accountType) =>
            dispatch(accountsUpdateImage(BunqJSClient, userId, accountId, attachmentId, accountType))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AccountCard);
