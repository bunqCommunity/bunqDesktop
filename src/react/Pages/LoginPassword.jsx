import React from "react";
import { Typography } from "material-ui";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Input from "material-ui/Input";
import Button from "material-ui/Button";
import Card, { CardContent } from "material-ui/Card";
import { CircularProgress } from "material-ui/Progress";
import { usersUpdate } from "../Actions/users";
import {
    registrationClearApiKey,
    registrationSetApiKey,
    registrationSetDeviceName,
    registrationSetEnvironment
} from "../Actions/registration";
import { Redirect } from "react-router-dom";
import {applicationDerivePassword} from "../Actions/application";

const styles = {
    loginButton: {
        width: "100%",
        marginTop: 20
    },
    clearButton: {
        width: "100%",
        marginTop: 20
    },
    passwordInput: {
        width: "100%",
        marginTop: 20
    },
    environmentToggle: {
        marginTop: 10
    },
    smallAvatar: {
        width: 50,
        height: 50
    }
};

class LoginPassword extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            password: "",
            passwordValid: false
        };
    }

    componentDidMount() {}

    setRegistration = () => {
        if (this.state.password.length < 7) {
            this.props.openSnackbar(
                "The password you entered should be atleast 7 characters long!"
            );
            return;
        }

        if (this.state.passwordValid) {
            this.props.derivePassword(this.state.password);
        }
    };

    handlePasswordChange = event => {
        const targetValue = event.target.value;
        this.setState({
            password: targetValue
        });
        this.validateInputs(targetValue);
    };

    validateInputs = password => {
        this.setState({
            passwordValid: password && password.length >= 7
        });
    };

    render() {
        const {
            status_message,
            applicationLoading,
            derivedPassword
        } = this.props;

        if (derivedPassword !== false) {
            return <Redirect to="/login" />;
        }

        const cardContent = applicationLoading ? (
            <CardContent style={{ textAlign: "center" }}>
                <Typography type="headline" component="h2">
                    Loading
                </Typography>
                <CircularProgress size={50} />
                <Typography type="subheading">{status_message}</Typography>
            </CardContent>
        ) : (
            <CardContent>
                <Typography type="headline" component="h2">
                    Enter a password
                </Typography>
                <Typography type="caption">
                    We use this password to securely store your data. We'll only
                    ask for it once when you start BunqDesktop. Losing it just
                    means you'll have to enter a password and your API key again
                    so we can log you back in.
                </Typography>
                <Input
                    style={styles.passwordInput}
                    error={!this.state.passwordValid}
                    type="password"
                    label="Password"
                    hint="A secure 7+ character password"
                    onChange={this.handlePasswordChange}
                    value={this.state.password}
                />

                <Button
                    raised
                    disabled={
                        this.state.passwordValid === false ||
                        this.props.applicationLoading === true
                    }
                    color={"primary"}
                    style={styles.loginButton}
                    onClick={this.setRegistration}
                >
                    Set password
                </Button>
            </CardContent>
        );

        return (
            <Grid container spacing={16} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Password Setup`}</title>
                </Helmet>

                <Grid item xs={12} sm={8} md={6}>
                    <Card>{cardContent}</Card>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        status_message: state.application.status_message,
        derivedPassword: state.application.derivedPassword,
        applicationLoading: state.application.loading,

        users: state.users.users,
        user: state.user.user,
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        derivePassword: password =>
            dispatch(applicationDerivePassword(password)),

        clearApiKey: () => dispatch(registrationClearApiKey(BunqJSClient)),

        setApiKey: api_key => dispatch(registrationSetApiKey(api_key)),
        setEnvironment: environment =>
            dispatch(registrationSetEnvironment(environment)),
        setDeviceName: device_name =>
            dispatch(registrationSetDeviceName(device_name)),

        // get latest user list from BunqJSClient
        usersUpdate: (updated = false) =>
            dispatch(usersUpdate(BunqJSClient, updated))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginPassword);
