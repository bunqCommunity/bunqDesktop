import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Input from "material-ui/Input";
import Button from "material-ui/Button";
import Avatar from "material-ui/Avatar";
import Card, { CardHeader, CardContent } from "material-ui/Card";
import { userLogin } from "../Actions/user";
import { usersUpdate } from "../Actions/users";
import { Typography } from "material-ui";
import {
    registrationClearApiKey,
    registrationSetApiKey,
    registrationSetDeviceName
} from "../Actions/registration";

const styles = {
    loginButton: {
        width: "100%",
        marginTop: 20
    },
    clearButton: {
        width: "100%",
        marginTop: 20
    },
    apiInput: {
        width: "100%",
        marginTop: 20
    },
    smallAvatar: {
        width: 50,
        height: 50
    }
};

class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            users: [],
            apiKey: "",
            deviceName: "My Device",
            attemptingLogin: false
        };
    }

    componentDidMount() {
        this.props.updateUsers();

        if (this.props.apiKey !== false) {
            this.setState({ apiKey: this.props.apiKey });
        }
        if (this.props.deviceName !== false) {
            this.setState({ deviceName: this.props.deviceName });
        }
    }

    setRegistration = () => {
        if (this.state.apiKey.length !== 64) {
            this.props.openSnackbar(
                "The API key you entered does not look valid"
            );
        } else {
            this.props.setApiKey(this.state.apiKey);
        }

        if (this.state.deviceName.length <= 5) {
            this.props.openSnackbar(
                "The device name has to be atleast 6 characters."
            );
        } else if (this.state.deviceName.length > 32) {
            this.props.openSnackbar(
                "The device name can't be longer than 32 characters."
            );
        } else {
            this.props.setDeviceName(this.state.deviceName);
        }
    };

    clearApiKey = () => {
        this.props.clearApiKey();
        this.setState({ apiKey: "" });
    };

    handleKeyChange = event => {
        this.setState({ apiKey: event.target.value });
    };
    handleNameChange = event => {
        this.setState({ deviceName: event.target.value });
    };

    selectAccount = (id, type) => {
        return () => {
            this.props.loginUser(id, type);
        };
    };

    render() {
        const userItems = this.props.users.map(user => {
            let avatar = `/api/attachment/${user.publicAttachmentUUID}`;

            return (
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardHeader
                            avatar={
                                <Avatar>
                                    <img
                                        style={styles.smallAvatar}
                                        src={avatar}
                                    />
                                </Avatar>
                            }
                            title={user.displayName}
                        />
                        <CardContent>
                            <Button
                                disabled={this.props.userLoading}
                                onClick={this.selectAccount(user.id, user.type)}
                                raised
                                color={"primary"}
                                style={styles.loginButton}
                            >
                                Login
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            );
        });

        let clearBtn = null;
        if (this.props.apiKey !== false) {
            clearBtn = (
                <Button
                    raised
                    color={"accent"}
                    style={styles.clearButton}
                    onClick={this.clearApiKey}
                    disabled={this.props.userLoading}
                >
                    Clear API key
                </Button>
            );
        }

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqWeb - Login`}</title>
                </Helmet>

                <Grid item xs={12} sm={2} md={3} />
                <Grid item xs={12} sm={8} md={6}>
                    <Card>
                        <CardContent>
                            <Typography type="headline" component="h2">
                                Enter your API Key
                            </Typography>
                            <p>
                                In the Bunq app go to your Profile > Security >
                                API Keys and generate a new key
                            </p>
                            <Input
                                style={styles.apiInput}
                                placeholder="API Key"
                                onChange={this.handleKeyChange}
                                value={this.state.apiKey}
                            />
                            <Input
                                style={styles.apiInput}
                                placeholder="Device Name"
                                onChange={this.handleNameChange}
                                value={this.state.deviceName}
                            />
                            <Button
                                raised
                                color={"primary"}
                                style={styles.loginButton}
                                onClick={this.setRegistration}
                                disabled={this.props.userLoading}
                            >
                                Set API Key
                            </Button>
                            {clearBtn}
                        </CardContent>
                    </Card>
                </Grid>

                {userItems}
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        apiKey: state.registration.api_key,
        deviceName: state.registration.device_name,
        users: state.users.users,
        user: state.user.user,
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        clearApiKey: () => dispatch(registrationClearApiKey()),
        setApiKey: api_key => dispatch(registrationSetApiKey(api_key)),
        setDeviceName: device_name =>
            dispatch(registrationSetDeviceName(device_name)),
        loginUser: (id, type) => dispatch(userLogin(id, type)),
        updateUsers: () => dispatch(usersUpdate())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
