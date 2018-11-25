import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import PropTypes from "prop-types";
import Avatar from "@material-ui/core/Avatar";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { formatMoney } from "../../Helpers/Utils";
import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import { filterShareInviteBankResponses } from "../../Helpers/DataFilters";
import GetShareDetailBudget from "../../Helpers/GetShareDetailBudget";

const styles = {
    formControl: {
        width: "100%"
    },
    selectField: {
        width: "100%"
    },
    bigAvatar: {
        width: 50,
        height: 50
    }
};

const AccountItem = ({ account, onClick, BunqJSClient, hideBalance, shareInviteBankResponses }) => {
    // format default balance
    let formattedBalance = account.balance ? account.balance.value : 0;

    const filteredInviteResponses = shareInviteBankResponses.filter(filterShareInviteBankResponses(account.id));

    // attempt to get connect budget if possible
    if (filteredInviteResponses.length > 0) {
        const connectBudget = GetShareDetailBudget(filteredInviteResponses);
        if (connectBudget) {
            formattedBalance = connectBudget;
        }
    }

    // hide balance if used
    formattedBalance = hideBalance ? "" : formatMoney(formattedBalance, true);

    return (
        <ListItem button onClick={onClick}>
            <Avatar style={styles.bigAvatar}>
                <LazyAttachmentImage
                    height={50}
                    BunqJSClient={BunqJSClient}
                    imageUUID={account.avatar.image[0].attachment_public_uuid}
                />
            </Avatar>
            <ListItemText primary={account.description} secondary={hideBalance ? "" : formattedBalance} />
        </ListItem>
    );
};

class AccountSelectorDialog extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    // Handles click events for account items
    onClickHandler = id => {
        return event => {
            this.setState({ open: false });
            this.props.onChange(id);
        };
    };

    handleRequestClose = () => {
        this.setState({ open: false });
    };

    openDialog = () => {
        this.setState({ open: true });
    };

    render() {
        const {
            BunqJSClient,
            accounts,
            value,
            hiddenConnectTypes,
            shareInviteBankResponses,
            t,
            ...otherProps
        } = this.props;
        const style = otherProps.style ? otherProps.style : {};

        const hideDraftOnly = hiddenConnectTypes.includes("draftOnly");
        const hideShowOnly = hiddenConnectTypes.includes("showOnly");

        const accountItems = accounts
            .filter(account => {
                return account.status === "ACTIVE";
            })
            .filter(account => {
                const filteredInviteResponses = shareInviteBankResponses.filter(
                    filterShareInviteBankResponses(account.id)
                );

                // no results means no filter required
                if (filteredInviteResponses.length == 0) return true;

                const firstInviteResponse = filteredInviteResponses.pop();
                const inviteResponse = firstInviteResponse.ShareInviteBankResponse;

                // get the key values for this list
                const shareDetailKeys = Object.keys(inviteResponse.share_detail);

                if (hideDraftOnly && shareDetailKeys.includes("ShareDetailDraftPayment")) {
                    return false;
                }
                if (hideShowOnly && shareDetailKeys.includes("ShareDetailReadOnly")) {
                    return false;
                }

                return true;
            })
            .map((account, accountKey) => {
                return (
                    <AccountItem
                        shareInviteBankResponses={shareInviteBankResponses}
                        onClick={this.onClickHandler(accountKey)}
                        hideBalance={this.props.hideBalance}
                        BunqJSClient={BunqJSClient}
                        account={account}
                    />
                );
            });

        let selectedAccountItem = null;
        if (value !== "" && accounts[value]) {
            selectedAccountItem = (
                <AccountItem
                    shareInviteBankResponses={shareInviteBankResponses}
                    hideBalance={this.props.hideBalance}
                    BunqJSClient={BunqJSClient}
                    account={accounts[value]}
                    onClick={this.openDialog}
                />
            );
        } else {
            selectedAccountItem = (
                <ListItem button onClick={this.openDialog}>
                    <ListItemText primary={t("Select an account")} />
                </ListItem>
            );
        }

        return (
            <FormControl style={{ ...styles.formControl, ...style }}>
                <Dialog open={this.state.open} onClose={this.handleRequestClose}>
                    <DialogTitle>{t("Select an account")}</DialogTitle>
                    <DialogContent>
                        <List>{accountItems}</List>
                    </DialogContent>
                </Dialog>
                {selectedAccountItem}
            </FormControl>
        );
    }
}

AccountSelectorDialog.propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired
};

AccountSelectorDialog.defaultProps = {
    hiddenConnectTypes: [],
    style: styles.formControl,
    selectStyle: styles.selectField
};

const mapStateToProps = state => {
    return {
        shareInviteBankResponses: state.share_invite_bank_responses.share_invite_bank_responses,

        hideBalance: state.options.hide_balance
    };
};

export default connect(mapStateToProps)(translate("translations")(AccountSelectorDialog));
