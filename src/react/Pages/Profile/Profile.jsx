import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import Address from "./Address";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import { openSnackbar } from "../../Actions/snackbar";
import { userLogin } from "../../Actions/user";
import BunqErrorHandler from "../../Helpers/BunqErrorHandler";

const styles = {
    title: {
        marginBottom: 8
    },
    textField: {
        width: "100%"
    },
    paper: {
        padding: 16,
        marginTop: 16
    },
    list: {
        textAlign: "left"
    },
    textCenter: {
        textAlign: "center"
    },
    circlePicker: {
        padding: 8
    }
};

class Profile extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,

            public_nick_name: "",

            address_main: {
                city: "",
                country: "",
                house_number: "",
                postal_code: "",
                po_box: "",
                street: ""
            },
            address_postal: {
                city: "",
                country: "",
                house_number: "",
                postal_code: "",
                po_box: "",
                street: ""
            }
        };
    }

    componentDidMount() {
        this.userToState();
    }

    componentDidUpdate(oldProps) {
        if (oldProps.userLoading === true && this.props.userLoading === false) {
            this.userToState();
        }
    }

    userToState = () => {
        const user = this.props.user;
        this.setState({
            public_nick_name: user.public_nick_name,
            address_main: this.normalizeAddress(user.address_main),
            address_postal: this.normalizeAddress(user.address_postal)
        });
    };

    normalizeAddress = address => {
        const formattedAddress = {};
        Object.keys(address).forEach(key => {
            formattedAddress[key] =
                address[key] !== null && typeof address[key] !== "undefined"
                    ? address[key]
                    : "";
        });
        return formattedAddress;
    };

    onChangeAddress = addressType => type => event => {
        // set the value for this address and type
        this.state[addressType][type] = event.target.value;
        // update the actual state
        this.setState({
            [addressType]: this.state[addressType]
        });
    };
    onChange = key => event => {
        this.setState({
            [key]: event.target.value
        });
    };

    updateSettings = () => {
        const { address_postal, address_main, public_nick_name } = this.state;
        const { t, user, userType, BunqJSClient } = this.props;
        const errorMessage = t("We failed to update your user information");
        this.setState({ loading: true });

        const userInfo = {
            address_postal: {
                city: address_postal.city,
                country: address_postal.country,
                house_number: address_postal.house_number,
                postal_code: address_postal.postal_code,
                po_box: address_postal.po_box,
                street: address_postal.street
            },
            address_main: {
                city: address_main.city,
                country: address_main.country,
                house_number: address_main.house_number,
                postal_code: address_main.postal_code,
                po_box: address_main.po_box,
                street: address_main.street
            },
            public_nick_name: public_nick_name
        };

        const apiHandler =
            userType === "UserPerson"
                ? BunqJSClient.api.userPerson
                : BunqJSClient.api.userCompany;

        apiHandler
            .put(user.id, userInfo)
            .then(response => {
                this.setState({ loading: false });
                this.props.userLogin(userType, true);
            })
            .catch(error => {
                this.setState({ loading: false });
                this.props.BunqErrorHandler(error, errorMessage);
            });
    };

    render() {
        const { t, user, userLoading } = this.props;

        let content = null;
        if (userLoading === false && this.state.loading === false) {
            content = (
                <React.Fragment>
                    <Paper style={styles.paper}>
                        <Grid container spacing={16}>
                            <Grid item xs={12}>
                                <TextField
                                    label={t("Public nick name")}
                                    style={styles.textField}
                                    value={this.state.public_nick_name}
                                    onChange={this.onChange("public_nick_name")}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TranslateTypography
                                    variant={"title"}
                                    style={styles.title}
                                >
                                    Main address
                                </TranslateTypography>
                                <Address
                                    t={t}
                                    address={this.state.address_main}
                                    onChange={this.onChangeAddress(
                                        "address_main"
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TranslateTypography
                                    variant={"title"}
                                    style={styles.title}
                                >
                                    Postal address
                                </TranslateTypography>
                                <Address
                                    t={t}
                                    address={this.state.address_postal}
                                    onChange={this.onChangeAddress(
                                        "address_postal"
                                    )}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    disabled={this.state.loading}
                                    onClick={this.updateSettings}
                                    variant={"raised"}
                                    color={"primary"}
                                >
                                    Update
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </React.Fragment>
            );
        } else {
            content = (
                <Paper style={styles.paper}>
                    <Grid container spacing={24} justify={"center"}>
                        <Grid item xs={12}>
                            <div style={{ textAlign: "center" }}>
                                <CircularProgress />
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            );
        }

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Profile")}`}</title>
                </Helmet>

                <Grid item xs={12} sm={2}>
                    <Button onClick={this.props.history.goBack}>
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8}>
                    {content}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        userType: state.user.user_type,
        userLoading: state.user.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        userLogin: (userType, updated) =>
            dispatch(userLogin(BunqJSClient, userType, updated)),

        BunqErrorHandler: (error, message) =>
            BunqErrorHandler(dispatch, error, message)
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Profile)
);
