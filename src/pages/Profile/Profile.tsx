import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Link from "react-router-dom/Link";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import UrlIcon from "@material-ui/icons/Link";
import { AppWindow } from "~app";

import AliasList from "~components/AliasList";
import UploadFullscreen from "~components/FileUpload/UploadFullscreen";
import LazyAttachmentImage from "~components/AttachmentImage/LazyAttachmentImage";
import MonetaryAccount from "~models/MonetaryAccount";
import { AppDispatch, ReduxState } from "~store/index";
import NotificationFilters from "./NotificationFilters";
import ProfileDetailsForm from "./ProfileDetailsForm";
import BusinessInfo from "./BusinessInfo";
import BillingInfo from "./BillingInfo";

import { userUpdateImage } from "~actions/user";
import { usersUpdate } from "~actions/users";

import BunqErrorHandler from "~functions/BunqErrorHandler";
import { ListItemSecondaryAction } from "@material-ui/core";

import { actions as snackbarActions } from "~store/snackbar";

declare let window: AppWindow;

const styles: any = {
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
    listItem: {
        paddingLeft: 8
    },
    list: {
        textAlign: "left"
    },
    textCenter: {
        textAlign: "center"
    },
    circlePicker: {
        padding: 8
    },
    avatar: {
        width: 70,
        height: 70
    },
    chip: {
        cursor: "pointer"
    }
};

interface IState {
    [key: string]: any;
}

interface IProps {
    t: AppWindow["t"];
}

class Profile extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    state: IState;

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            totalBalance: 0,
            normalizedUserInfo: false,

            displayUploadScreen: false
        };
    }

    componentDidMount() {
        this.userToState();

        const totalBalance = this.calculateTotalBalance();
        this.setState({
            totalBalance: totalBalance
        });
    }

    componentDidUpdate(oldProps) {
        if (oldProps.userLoading === false && this.props.userLoading === true) {
            // if user data is loading, reset the initial user state
            this.setState({
                normalizedUserInfo: false
            });
        }
        if (oldProps.userLoading === true && this.props.userLoading === false) {
            this.userToState();
        }

        if (oldProps.accountsLoading === true && this.props.accountsLoading === false) {
            const totalBalance = this.calculateTotalBalance();
            this.setState({
                totalBalance: totalBalance
            });
        }
    }

    onChange = key => event => {
        this.setState({
            [key]: event.target.value
        });
    };

    calculateTotalBalance = () => {
        return this.props.accounts.reduce((total, account) => {
            const monetaryAccount = new MonetaryAccount(account);
            return total + monetaryAccount.getBalance();
        }, 0);
    };

    userToState = () => {
        const user = this.props.user;
        this.setState({
            normalizedUserInfo: {
                public_nick_name: user.public_nick_name,
                address_main: this.normalizeAddress(user.address_main),
                address_postal: this.normalizeAddress(user.address_postal)
            }
        });
    };

    normalizeAddress = address => {
        const formattedAddress = {};
        Object.keys(address).forEach(key => {
            formattedAddress[key] = address[key] !== null && typeof address[key] !== "undefined" ? address[key] : "";
        });
        return formattedAddress;
    };

    handleFileUpload = fileUUID => {
        const { user, userType } = this.props;

        if (fileUUID) {
            this.props.userUpdateImage(user.id, fileUUID, userType);
        }
    };

    toggleFileUploadDialog = () => {
        this.setState({
            displayUploadScreen: !this.state.displayUploadScreen
        });
    };

    updateSettings = data => {
        const BunqJSClient = window.BunqDesktopClient.BunqJSClient;
        const { address_postal, address_main, public_nick_name } = data;

        const { t, user, userType } = this.props;
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

        const apiHandler = userType === "UserPerson" ? BunqJSClient.api.userPerson : BunqJSClient.api.userCompany;

        apiHandler
            .put(user.id, userInfo)
            .then(response => {
                this.setState({ loading: false });
                this.props.usersUpdate(true);
                this.props.history.push("/");
            })
            .catch(error => {
                this.setState({ loading: false });
                this.props.BunqErrorHandler(error, errorMessage);
            });
    };

    render() {
        const { t, user, userType, userLoading } = this.props;
        const { totalBalance } = this.state;

        let content = null;
        if (userLoading === false && this.state.loading === false) {
            content = (
                <>
                    <UploadFullscreen
                        open={this.state.displayUploadScreen}
                        onComplete={this.handleFileUpload}
                        onClose={this.toggleFileUploadDialog}
                    />

                    <Paper style={{ ...styles.paper, paddingTop: 0 }}>
                        <List>
                            <ListItem style={styles.listItem}>
                                <Avatar
                                    style={{ ...styles.avatar, cursor: "pointer" }}
                                    onClick={_ =>
                                        this.setState({
                                            displayUploadScreen: true
                                        })
                                    }
                                >
                                    <LazyAttachmentImage
                                        height={70}
                                        imageUUID={user.avatar.image[0].attachment_public_uuid}
                                    />
                                </Avatar>
                                <ListItemText primary={user.public_nick_name} secondary={user.legal_name} />
                                <ListItemSecondaryAction>
                                    <Chip
                                        style={styles.chip}
                                        avatar={
                                            <Avatar>
                                                <UrlIcon />
                                            </Avatar>
                                        }
                                        component={Link}
                                        label={t("bunqme links")}
                                        to="/bunqme-personal"
                                    />
                                </ListItemSecondaryAction>
                            </ListItem>

                            <AliasList aliasses={user.alias} />
                        </List>

                        {this.state.normalizedUserInfo && (
                            <ProfileDetailsForm
                                initialValues={this.state.normalizedUserInfo}
                                onSubmit={this.updateSettings}
                            />
                        )}
                    </Paper>

                    <BusinessInfo t={t} onChange={this.onChange} totalBalance={totalBalance} userType={userType} />

                    <BillingInfo
                        t={t}
                        user={user}
                        BunqErrorHandler={this.props.BunqErrorHandler}
                    />

                    <NotificationFilters
                        t={t}
                        user={user}
                        userType={userType}
                        usersUpdate={this.props.usersUpdate}
                        BunqErrorHandler={this.props.BunqErrorHandler}
                    />
                </>
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
                    <title>{`bunqDesktop - ${t("Profile")}`}</title>
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

const mapStateToProps = (state: ReduxState) => {
    return {
        user: state.user.user,
        userType: state.user.user_type,
        userLoading: state.user.loading,
        accounts: state.accounts.accounts,
        accountsLoading: state.accounts.loading
    };
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        openSnackbar: message => dispatch(snackbarActions.open({ message })),
        usersUpdate: updated => dispatch(usersUpdate(updated)),
        userUpdateImage: (userId, attachmentId) => dispatch(userUpdateImage(userId, attachmentId)),

        BunqErrorHandler: (error, message) => {
            const actions = [];
            BunqErrorHandler(actions, error, message)
            dispatch(actions);
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(Profile));
