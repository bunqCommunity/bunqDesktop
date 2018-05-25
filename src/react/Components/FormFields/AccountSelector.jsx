import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import GetShareDetailBudget from "../../Helpers/GetShareDetailBudget";
import { formatMoney } from "../../Helpers/Utils";
import { filterShareInviteBankResponses } from "../../Helpers/Filters";

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

class AccountSelector extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { accounts, onChange, value, ...otherProps } = this.props;

        const selectId = otherProps.id ? otherProps.id : "account-selector";
        const style = otherProps.style ? otherProps.style : {};

        const accountItems = accounts.map((account, accountKey) => {
            const bankAccount = account;
            let balance = bankAccount.balance.value;
            const description = bankAccount.description;

            // check if this account item has connect details
            const filteredInviteResponses = this.props.shareInviteBankResponses.filter(
                filterShareInviteBankResponses(account.id)
            );

            // get budget if atleast one connect
            if (filteredInviteResponses.length > 0) {
                const connectBudget = GetShareDetailBudget(
                    filteredInviteResponses
                );
                if (connectBudget) {
                    balance = connectBudget;
                }
            }

            balance = formatMoney(balance);

            return (
                <MenuItem value={accountKey}>
                    {description} - {balance}
                </MenuItem>
            );
        });

        let selectedAccountItem = null;
        if (value !== "" && accounts[value]) {
            const account = accounts[value];
            if (account.status !== "ACTIVE") {
                return null;
            }

            // format default balance
            let formattedBalance = account.balance ? account.balance.value : 0;

            // attempt to get connect budget if possible
            if (this.props.shareInviteBankResponses.length > 0) {
                const filteredInviteResponses = this.props.shareInviteBankResponses.filter(
                    filterShareInviteBankResponses(account.id)
                );

                const connectBudget = GetShareDetailBudget(
                    filteredInviteResponses
                );
                if (connectBudget) {
                    formattedBalance = connectBudget;
                }
            }

            // hide balance if used or format it
            formattedBalance = this.props.hideBalance
                ? ""
                : formatMoney(formattedBalance);

            selectedAccountItem = (
                <ListItem button>
                    <Avatar style={styles.bigAvatar}>
                        <LazyAttachmentImage
                            width={50}
                            BunqJSClient={this.props.BunqJSClient}
                            imageUUID={
                                account.avatar.image[0].attachment_public_uuid
                            }
                        />
                    </Avatar>
                    <ListItemText
                        primary={account.description}
                        secondary={formattedBalance}
                    />
                </ListItem>
            );
        }

        return (
            <FormControl style={{ ...styles.formControl, ...style }}>
                <InputLabel htmlFor={selectId}>Account</InputLabel>
                <Select
                    required
                    value={value}
                    onChange={onChange}
                    input={<Input id={selectId} />}
                >
                    {accountItems}
                </Select>
                {selectedAccountItem}
            </FormControl>
        );
    }
}

AccountSelector.propTypes = {
    value: PropTypes.any.isRequired,
    onChange: PropTypes.func.isRequired
};

AccountSelector.defaultProps = {
    style: styles.formControl,
    selectStyle: styles.selectField
};

const mapStateToProps = state => {
    return {
        shareInviteBankResponses:
            state.share_invite_bank_responses.share_invite_bank_responses,

        hideBalance: state.options.hide_balance
    };
};

export default connect(mapStateToProps)(AccountSelector);
