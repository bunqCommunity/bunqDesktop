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
import { ReduxState } from "~store/index";

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";

import { formatMoney } from "~functions/Utils";
import { filterShareInviteMonetaryAccountResponses } from "~functions/DataFilters";
import { connectGetBudget } from "~functions/ConnectGetPermissions";

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

const AccountItem = ({ account, onClick, hideBalance, shareInviteMonetaryAccountResponses }) => {
    // format default balance
    let formattedBalance = account.balance ? account.balance.value : 0;

    const filteredInviteResponses = shareInviteMonetaryAccountResponses.filter(
        filterShareInviteMonetaryAccountResponses(account.id)
    );

    // attempt to get connect budget if possible
    if (filteredInviteResponses.length > 0) {
        const connectBudget = connectGetBudget(filteredInviteResponses);
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
                    imageUUID={account.avatar.image[0].attachment_public_uuid}
                />
            </Avatar>
            <ListItemText primary={account.description} secondary={hideBalance ? "" : formattedBalance} />
        </ListItem>
    );
};

interface IState {
}

interface IProps {
    value: any;
    onChange: Function;
}

class AccountSelectorDialog extends React.Component<ReturnType<typeof mapStateToProps> & IProps> {
    static defaultProps = {
        hiddenConnectTypes: [],
        style: styles.formControl,
        selectStyle: styles.selectField
    };

    state: IState;

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
            accounts,
            value,
            hiddenConnectTypes,
            shareInviteMonetaryAccountResponses,
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
                const filteredInviteResponses = shareInviteMonetaryAccountResponses.filter(
                    filterShareInviteMonetaryAccountResponses(account.id)
                );

                // no results means no filter required
                if (filteredInviteResponses.length == 0) return true;

                const firstInviteResponse = filteredInviteResponses.pop();
                const inviteResponse = firstInviteResponse.ShareInviteMonetaryAccountResponse;

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
                        shareInviteMonetaryAccountResponses={shareInviteMonetaryAccountResponses}
                        onClick={this.onClickHandler(accountKey)}
                        hideBalance={this.props.hideBalance}
                        account={account}
                    />
                );
            });

        let selectedAccountItem = null;
        if (value !== "" && accounts[value]) {
            selectedAccountItem = (
                <AccountItem
                    shareInviteMonetaryAccountResponses={shareInviteMonetaryAccountResponses}
                    hideBalance={this.props.hideBalance}
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

const mapStateToProps = (state: ReduxState) => {
    return {
        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses,

        hideBalance: state.options.hide_balance
    };
};

export default connect(mapStateToProps)(translate("translations")(AccountSelectorDialog));
