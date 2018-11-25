import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";

import AccountListItemChip from "../../AccountList/AccountListItemChip";

const renderAccountsPicker = ({ t, i18n, tReady, input, label, meta: { error }, accounts, ...otherProps }) => {
    const inputValue = input.value;
    const inputOnChange = input.onChange;

    const onClick = accountId => e => {
        const accountIds = [...inputValue];
        const existingIndex = accountIds.findIndex(accountIdA => accountIdA === accountId);
        if (existingIndex < 0) {
            // add id to the list
            accountIds.push(accountId);
        }

        // update onChange event
        inputOnChange(accountIds);
    };
    const onDelete = accountId => e => {
        const accountIds = [...inputValue];
        const existingIndex = accountIds.findIndex(accountIdA => accountIdA === accountId);
        if (existingIndex > -1) {
            // remove item from the list
            accountIds.splice(existingIndex, 1);
        }

        // update onChange event
        inputOnChange(accountIds);
    };

    const selectedAccounts = accounts
        .filter(account => {
            return account.status === "ACTIVE" && inputValue.includes(account.id);
        })
        .map(account => {
            return <AccountListItemChip account={account} onDelete={onDelete(account.id)} />;
        });
    const unSelectedAccounts = accounts
        .filter(account => {
            return account.status === "ACTIVE" && !inputValue.includes(account.id);
        })
        .map(account => {
            return <AccountListItemChip account={account} onClick={onClick(account.id)} />;
        });

    return (
        <Grid container spacing={8}>
            <Grid item xs={12}>
                <Typography variant="body1" style={{ color: error ? "#ec2616" : "" }}>
                    {label}
                </Typography>
            </Grid>
            <Grid item xs={12}>
                {error && (
                    <Typography variant="body2" style={{ color: "#ec2616" }}>
                        {error}
                    </Typography>
                )}
            </Grid>

            <Grid item xs={12}>
                {selectedAccounts}
            </Grid>
            <Grid item xs={12}>
                {unSelectedAccounts}
            </Grid>
        </Grid>
    );
};

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts
    };
};

export default connect(mapStateToProps)(translate("translations")(renderAccountsPicker));
