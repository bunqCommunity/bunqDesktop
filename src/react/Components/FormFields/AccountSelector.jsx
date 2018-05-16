import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Input  from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/Menu";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

import LazyAttachmentImage from "../AttachmentImage/LazyAttachmentImage";
import { formatMoney } from "../../Helpers/Utils";

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
            const balance = bankAccount.balance.value;
            const description = bankAccount.description;

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
            const formattedBalance = this.props.hideBalance
                ? ""
                : formatMoney(account.balance ? account.balance.value : 0, true);
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

const mapStateToProps = store => {
    return {
        hideBalance: store.options.hide_balance
    };
};

export default connect(mapStateToProps)(AccountSelector);
