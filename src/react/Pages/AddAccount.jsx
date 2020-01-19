import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import CirclePicker from "react-color/lib/Circle";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Radio from "@material-ui/core/Radio";
import RadioGroup from "@material-ui/core/RadioGroup";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { openSnackbar } from "../Actions/snackbar";
import { createAccount } from "../Actions/accounts";

import MoneyFormatInput from "../Components/FormFields/MoneyFormatInput";
import TranslateButton from "../Components/TranslationHelpers/Button";
import TranslateTypography from "../Components/TranslationHelpers/Typography";

const styles = {
    bigAvatar: {
        width: 60,
        height: 60
    },
    btn: {
        width: "100%"
    },
    paper: {
        padding: 24,
        marginBottom: 16
    },
    list: {
        textAlign: "left"
    },
    textCenter: {
        textAlign: "center"
    },
    colorPickerWrapper: {
        display: "flex",
        justifyContent: "center"
    }
};

class AddAccount extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            color: "#2196f3",

            description: "",
            descriptionError: false,

            limit: 1000,
            limitError: false,

            savingsGoal: 0,
            savingsGoalError: false,

            validForm: false,
            accountType: "MonetaryAccountBank"
        };
    }

    createAccount = () => {
        if (!this.state.validForm) {
            return false;
        }
        const { user } = this.props;

        this.props.createAccount(
            user.id,
            "EUR",
            this.state.description,
            this.state.limit + "",
            this.state.color,
            this.state.savingsGoal + "",
            this.state.accountType
        );
    };

    handleChange = name => event => {
        this.setState(
            {
                [name]: event.target.value
            },
            () => {
                this.validateForm();
            }
        );
    };

    handleChangeFormatted = name => valueObject => {
        this.setState(
            {
                [name]: valueObject.formattedValue.length > 0 ? valueObject.floatValue : ""
            },
            () => {
                this.validateForm();
            }
        );
    };

    handleColorClick = color => {
        this.setState({ color: color.hex });
    };

    validateForm = () => {
        const { description, limit, accountType, savingsGoal } = this.state;

        let savingsGoalError = false;
        if (accountType === "MonetaryAccountSavings") {
            if (!savingsGoal) {
                savingsGoalError = savingsGoal < 0.01 || savingsGoal > 100000;
            }
        }
        const limitErrorCondition = limit < 0.01 || limit > 100000;
        const descriptionErrorCondition = description.length < 1 || description.length > 140;

        this.setState({
            limitError: limitErrorCondition,
            descriptionError: descriptionErrorCondition,
            validForm: !limitErrorCondition && !descriptionErrorCondition && !savingsGoalError,
            savingsGoalError: savingsGoalError
        });
    };

    render() {
        const t = this.props.t;

        const accountsAmount = this.props.accounts.reduce((accumulator, account) => {
            if (account.status === "ACTIVE") {
                return accumulator + 1;
            }
            return accumulator;
        }, 0);

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`bunqDesktop - ${t("Add an account")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={3} md={4}>
                    <Button onClick={this.props.history.goBack} style={styles.btn}>
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Paper style={styles.paper}>
                        <TranslateTypography variant="h5" style={{ marginBottom: "25px" }}>
                            Add an account
                        </TranslateTypography>

                        <div style={styles.colorPickerWrapper}>
                            <CirclePicker
                                onChange={this.handleColorClick}
                                color={this.state.color}
                                style={styles.circlePicker}
                            />
                        </div>

                        <TextField
                            fullWidth
                            error={this.state.descriptionError}
                            id="description"
                            label={t("Description")}
                            onChange={this.handleChange("description")}
                            value={this.state.description}
                            margin="normal"
                        />

                        <FormControl error={this.state.limitError}>
                            <TranslateTypography type="body2">Daily limit</TranslateTypography>
                            <MoneyFormatInput
                                id="limit"
                                onValueChange={this.handleChangeFormatted("limit")}
                                value={this.state.limit}
                            />
                        </FormControl>

                        <FormControl component="fieldset">
                            <FormLabel component="legend">Account type</FormLabel>
                            <RadioGroup
                                id="accountType"
                                value={this.state.accountType}
                                onChange={this.handleChange("accountType")}
                            >
                                <FormControlLabel
                                    value="MonetaryAccountBank"
                                    control={<Radio />}
                                    label="Regular account"
                                />
                                <FormControlLabel
                                    value="MonetaryAccountSavings"
                                    control={<Radio />}
                                    label="Savings account"
                                />
                            </RadioGroup>
                        </FormControl>

                        {this.state.accountType === "MonetaryAccountSavings" && (
                            <FormControl error={this.state.savingsGoalError}>
                                <TranslateTypography type="body2">Savings goal</TranslateTypography>
                                <MoneyFormatInput
                                    id="savings-goal"
                                    onValueChange={this.handleChangeFormatted("savingsGoal")}
                                    value={this.state.savingsGoal}
                                />
                            </FormControl>
                        )}

                        <TranslateButton
                            variant="contained"
                            color="primary"
                            disabled={
                                !this.state.validForm || this.props.accountsLoading || this.props.accountsCreateLoading
                            }
                            onClick={this.createAccount}
                            style={styles.btn}
                        >
                            Create account
                        </TranslateButton>
                    </Paper>
                </Grid>

                {accountsAmount >= 25 ? (
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper style={{ padding: 8 }}>
                            <TranslateTypography variant="subtitle1">Attention!</TranslateTypography>
                            <TranslateTypography variant="body2">
                                Creating a new account when you've reached the limit of 25 accounts comes at additional
                                costs You may have to create the new account using the official bunq app to approve
                                these
                            </TranslateTypography>
                        </Paper>
                    </Grid>
                ) : null}
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,
        accountsLoading: state.accounts.loading,
        accountsCreateLoading: state.accounts.create_loading,

        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        createAccount: (userId, currency, description, dailyLimit, color, savingsGoal, accountType) =>
            dispatch(
                createAccount(BunqJSClient, userId, currency, description, dailyLimit, color, savingsGoal, accountType)
            ),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(AddAccount));
