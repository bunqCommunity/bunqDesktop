import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import { formValueSelector } from "redux-form";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";

import ClearIcon from "@material-ui/icons/Clear";

import TranslateTypography from "~components/TranslationHelpers/Typography";
import TranslateButton from "~components/TranslationHelpers/Button";
import MoneyFormatInput from "~components/FormFields/MoneyFormatInput";
import { calculateTotalBalance } from "~components/SavingsGoals/Helpers";
import { ReduxState } from "~store/index";

const formSelector = formValueSelector("savingsGoal");

const styles = {
    labelWrapper: {
        display: "flex"
    },
    label: {
        flexGrow: 1
    },
    iconButton: {
        padding: 3
    },
    formControl: {
        marginBottom: 10
    },
    moneyInput: {
        marginTop: 16
    }
};

const handleChangeFormatted = onChange => valueObject => {
    const onChangeValue = valueObject.formattedValue.length > 0 ? valueObject.floatValue : "";
    onChange(onChangeValue);
};

interface IProps {
}

const renderTextField = ({
    t,
    i18n,
    tReady,
    input,
    label,
    style = {},
    dispatch,
    accounts = [],
    accountIds = [],
    shareInviteMonetaryAccountResponses = [],
    formStyle = {},
    meta: { touched, error },
    ...custom
}: ReturnType<typeof mapStateToProps> & IProps) => {
    const { onChange, onBlur, onFocus, onDrop, ...restInputProps } = input;

    const errorStyle = { color: error ? "#ec2616" : "" };
    const errorComponent = error && (
        <TranslateTypography key="errorTypography" variant="body2" style={{ ...errorStyle, flexGrow: 1 }}>
            {error}
        </TranslateTypography>
    );
    const handleOnChange = handleChangeFormatted(onChange);

    // gets total balance from selected accounts
    const setAccountBalances = () => {
        const accountsTotalFunds = calculateTotalBalance(accounts, accountIds, shareInviteMonetaryAccountResponses);

        onChange(accountsTotalFunds);
    };
    const setAmountToZero = () => onChange(0);

    return (
        <FormControl style={styles.formControl} style={formStyle} error={touched && !!error} fullWidth>
            <div key="inputWrapper" style={styles.labelWrapper}>
                <TranslateTypography variant="body1" style={{ ...errorStyle, ...styles.label }}>
                    {label}
                </TranslateTypography>
                <IconButton onClick={setAmountToZero} style={styles.iconButton}>
                    <ClearIcon />
                </IconButton>
            </div>
            {errorComponent}

            <MoneyFormatInput
                key="moneyInput"
                onValueChange={handleOnChange}
                style={{ ...styles.moneyInput, ...style }}
                {...restInputProps}
                {...custom}
            />
            <TranslateButton key="helperTypography" variant="outlined" onClick={setAccountBalances}>
                Use account balances
            </TranslateButton>
        </FormControl>
    );
};

const mapStateToProps = (state: ReduxState) => {
    return {
        accountIds: formSelector(state, "account_ids"),
        accounts: state.accounts.accounts,
        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses
    };
};

export default connect(mapStateToProps)(translate("translations")(renderTextField));
