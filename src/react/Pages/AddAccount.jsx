import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Button from "material-ui/Button";
import IconButton from "material-ui/IconButton";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import Paper from "material-ui/es/Paper/Paper";
import TextField from "material-ui/TextField";
import { FormControl } from "material-ui/Form";

import RadioButtonUnchecked from "material-ui-icons/RadioButtonUnchecked";
import RadioButtonChecked from "material-ui-icons/RadioButtonChecked";

import { openSnackbar } from "../Actions/snackbar";
import { createAccount } from "../Actions/accounts";

import MoneyFormatInput from "../Components/FormFields/MoneyFormatInput";
import ButtonTranslate from "../Components/TranslationHelpers/Button";
import TypographyTranslate from "../Components/TranslationHelpers/Typography";

const colors = [
    "FEC704",
    "FD8B03",
    "FD2248",
    "4C4CD1",
    "BC3DFE",
    "006BFF",
    "49C1FD",
    "00C6B8",
    "80FD26",
    "3CD753",
    "B4B5B6",
    "83838A",
    "000001"
];

const styles = {
    bigAvatar: {
        width: 60,
        height: 60
    },
    btn: {},
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

class AddAccount extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            color: "FEC704",
            description: "",
            descriptionError: false,
            limit: 1000,
            limitError: false,
            validForm: false
        };
    }

    static getColorStyle(colorString) {
        return { color: colorString };
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
            "#" + this.state.color
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

    handleColorClick(color) {
        this.setState({ color: color });
    }

    getRadioButton(color) {
        let button = "";
        if (this.state.color === color) {
            button = (
                <RadioButtonChecked style={AccountInfo.getColorStyle(color)} />
            );
        } else {
            button = (
                <RadioButtonUnchecked
                    style={AccountInfo.getColorStyle(color)}
                />
            );
        }
        return button;
    }

    validateForm = () => {
        const { color, description, limit } = this.state;

        const limitErrorCondition = limit < 0.01 || limit > 10000;
        const descriptionErrorCondition =
            description.length < 1 || description.length > 140;

        this.setState({
            limitError: limitErrorCondition,
            descriptionError: descriptionErrorCondition,
            validForm: !limitErrorCondition && !descriptionErrorCondition
        });
    };

    render() {
        const t = this.props.t;

        return (
            <Grid container spacing={8}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Add an account")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={2} md={3}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8} md={6}>
                    <Paper style={styles.paper}>
                        <TypographyTranslate
                            type="headline"
                            style={{ marginBottom: "25px" }}
                        >
                            Add an account
                        </TypographyTranslate>
                        {colors.map(color => (
                            <IconButton
                                onClick={this.handleColorClick.bind(
                                    this,
                                    color
                                )}
                            >
                                {this.getRadioButton(color)}
                            </IconButton>
                        ))}
                        <TextField
                            fullWidth
                            error={this.state.descriptionError}
                            id="description"
                            label={t("Description")}
                            onChange={this.handleChange("description")}
                            value={this.state.description}
                            margin="normal"
                        />
                        <FormControl
                            style={styles.formControlAlt}
                            error={this.state.limitError}
                            fullWidth
                        >
                            <TypographyTranslate type="body2">
                                Daily limit
                            </TypographyTranslate>
                            <MoneyFormatInput
                                id="limit"
                                onValueChange={this.handleChangeFormatted}
                                value={this.state.limit}
                            />
                        </FormControl>
                        <ButtonTranslate
                            variant="raised"
                            color="primary"
                            disabled={!this.state.validForm}
                            onClick={this.createAccount}
                        >
                            Create account
                        </ButtonTranslate>
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
        createAccount: (userId, currency, description, dailyLimit, color) =>
            dispatch(
                createAccount(
                    BunqJSClient,
                    userId,
                    currency,
                    description,
                    dailyLimit,
                    color
                )
            ),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(AddAccount)
);
