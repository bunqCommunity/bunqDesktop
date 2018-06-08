import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { openSnackbar } from "../Actions/snackbar";

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
    }
};

class Connect extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            color: "#2196f3",
            description: "",
            descriptionError: false,
            budget: 1000,
            budgetError: false,
            validForm: false
        };
    }

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
                limit:
                    valueObject.formattedValue.length > 0
                        ? valueObject.floatValue
                        : ""
            },
            () => {
                this.validateForm();
            }
        );
    };

    validateForm = () => {
        const { description, budget } = this.state;

        const budgetErrorCondition = budget < 0.01 || budget > 10000;
        const descriptionErrorCondition =
            description.length < 1 || description.length > 140;

        this.setState({
            budgetError: budgetErrorCondition,
            descriptionError: descriptionErrorCondition,
            validForm: !budgetErrorCondition && !descriptionErrorCondition
        });
    };

    render() {
        const t = this.props.t;

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Add an account")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={3} md={4}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} md={4}>
                    <Paper style={styles.paper}>
                        <TypographyTranslate
                            type="headline"
                            style={{ marginBottom: "25px" }}
                        >
                            Add an account
                        </TypographyTranslate>

                        <TextField
                            fullWidth
                            error={this.state.descriptionError}
                            id="description"
                            label={t("Description")}
                            onChange={this.handleChange("description")}
                            value={this.state.description}
                            margin="normal"
                        />

                        <FormControl error={this.state.budgetError}>
                            <TypographyTranslate type="body2">
                                Budget
                            </TypographyTranslate>
                            <MoneyFormatInput
                                id="budget"
                                onValueChange={this.handleChangeFormatted}
                                value={this.state.budget}
                            />
                        </FormControl>

                        {/*<ButtonTranslate*/}
                            {/*variant="raised"*/}
                            {/*color="primary"*/}
                            {/*disabled={!this.state.validForm}*/}
                            {/*onClick={this.createAccount}*/}
                            {/*style={styles.btn}*/}
                        {/*>*/}
                            {/*Create account*/}
                        {/*</ButtonTranslate>*/}
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Connect)
);
