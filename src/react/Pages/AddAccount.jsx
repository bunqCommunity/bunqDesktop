import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import CirclePicker from "react-color/lib/Circle";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { openSnackbar } from "../Actions/snackbar";
import { createAccount } from "../Actions/accounts";

import MoneyFormatInput from "../Components/FormFields/MoneyFormatInput";
import ButtonTranslate from "../Components/TranslationHelpers/Button";
import TypographyTranslate from "../Components/TranslationHelpers/Typography";

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
            validForm: false
        };
    }

    createAccount = () => {
        if (!this.state.validForm) {
            return false;
        }
        const { user } = this.props;

        this.props.createAccount(user.id, "EUR", this.state.description, this.state.limit + "", this.state.color);
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

    handleChangeFormatted = valueObject => {
        this.setState(
            {
                limit: valueObject.formattedValue.length > 0 ? valueObject.floatValue : ""
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
        const { description, limit } = this.state;

        const limitErrorCondition = limit < 0.01 || limit > 10000;
        const descriptionErrorCondition = description.length < 1 || description.length > 140;

        this.setState({
            limitError: limitErrorCondition,
            descriptionError: descriptionErrorCondition,
            validForm: !limitErrorCondition && !descriptionErrorCondition
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
                        <TypographyTranslate variant="headline" style={{ marginBottom: "25px" }}>
                            Add an account
                        </TypographyTranslate>

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
                            <TypographyTranslate type="body2">Daily limit</TypographyTranslate>
                            <MoneyFormatInput
                                id="limit"
                                onValueChange={this.handleChangeFormatted}
                                value={this.state.limit}
                            />
                        </FormControl>

                        <ButtonTranslate
                            variant="raised"
                            color="primary"
                            disabled={!this.state.validForm || this.props.accountsLoading}
                            onClick={this.createAccount}
                            style={styles.btn}
                        >
                            Create account
                        </ButtonTranslate>
                    </Paper>
                </Grid>

                {accountsAmount === 25 ? (
                    <Grid item xs={12} sm={6} md={4}>
                        <Paper style={{ padding: 8 }}>
                            <TypographyTranslate variant="subheading">Attention!</TypographyTranslate>
                            <TypographyTranslate variant="body2">
                                Creating a new account when you've reached the limit of 25 accounts comes at additional
                                costs You may have to create the new account using the official bunq app to approve
                                these
                            </TypographyTranslate>
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

        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        createAccount: (userId, currency, description, dailyLimit, color) =>
            dispatch(createAccount(BunqJSClient, userId, currency, description, dailyLimit, color)),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(AddAccount));
