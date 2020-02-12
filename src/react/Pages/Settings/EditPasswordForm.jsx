import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Grid from "@material-ui/core/Grid";
import TextField from "@material-ui/core/TextField";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import TranslateButton from "../../Components/TranslationHelpers/Button";

import { registrationChangePassword } from "../../Actions/registration";

const styles = {
    textField: {
        width: "100%"
    },
    button: {
        width: "100%",
        textAlign: "center"
    }
};

class EditPasswordForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            newPassword: "",
            newPasswordTouched: false,
            newPasswordValid: false
        };
    }

    render() {
        return this.props.registrationReady ? (
            <Grid container spacing={16}>
                <Grid item xs={12}>
                    <TranslateTypography variant="h5">Password options</TranslateTypography>
                </Grid>
                <Grid item xs={12}>
                    <TranslateTypography variant="body2">
                        Your password will be changed and the current API key along with all other stored API keys with
                        this password will be changed
                    </TranslateTypography>
                </Grid>
                <Grid item xs={12} sm={6} md={8}>
                    <TextField
                        style={styles.textField}
                        value={this.state.newPassword}
                        type="password"
                        onChange={e => {
                            const newPassword = e.target.value;
                            this.setState({
                                newPassword: newPassword,
                                newPasswordValid: newPassword && newPassword.length >= 7,
                                newPasswordTouched: true
                            });
                        }}
                        error={!this.state.newPasswordValid && this.props.newPasswordTouched}
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={4}>
                    <TranslateButton
                        variant="outlined"
                        color="primary"
                        style={styles.button}
                        disabled={!this.state.newPasswordValid}
                        onClick={() => {
                            this.props.registrationChangePassword(this.state.newPassword);
                            this.setState({
                                newPassword: "",
                                newPasswordValid: false,
                                newPasswordTouched: false
                            });
                        }}
                    >
                        Set a new password
                    </TranslateButton>
                </Grid>
            </Grid>
        ) : null;
    }
}

const mapStateToProps = state => {
    return {
        registrationReady: state.registration.ready
    };
};

const mapDispatchToProps = dispatch => {
    return {
        registrationChangePassword: newPassword => dispatch(registrationChangePassword(newPassword))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(EditPasswordForm));
