import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Avatar from "@material-ui/core/Avatar";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import TranslateTypography from "../../Components/TranslationHelpers/Typography";
import ProfileDetailsForm from "./ProfileDetailsForm";
import UploadFullscreen from "../../Components/FileUpload/UploadFullscreen";
import LazyAttachmentImage from "../../Components/AttachmentImage/LazyAttachmentImage";

import { openSnackbar } from "../../Actions/snackbar";
import { userUpdateImage } from "../../Actions/user";
import { usersUpdate } from "../../Actions/users";

import BunqErrorHandler from "../../Functions/BunqErrorHandler";
import { formatMoney } from "../../Functions/Utils";

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
    },
    avatar: {
        width: 70,
        height: 70
    }
};

class Profile extends React.Component {
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

    calculateTotalBalance = () => {
        return this.props.accounts.reduce((total, account) => {
            return total + account.getBalance();
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

    onChange = key => event => {
        this.setState({
            [key]: event.target.value
        });
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
        const { address_postal, address_main, public_nick_name } = data;

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

        const apiHandler = userType === "UserPerson" ? BunqJSClient.api.userPerson : BunqJSClient.api.userCompany;

        apiHandler
            .put(user.id, userInfo)
            .then(response => {
                this.setState({ loading: false });
                this.props.usersUpdate(true);
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
            let businessInfo = null;
            if (userType === "UserCompany") {
                const safeKeepingValue = totalBalance - 100000;
                const hasSafeKeepingFee = safeKeepingValue > 0;

                let costsTable = null;
                if (hasSafeKeepingFee) {
                    costsTable = (
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>{t("Days")}</TableCell>
                                    <TableCell numeric>{t("Estimated total cost")}</TableCell>
                                    <TableCell numeric>{t("Balance after payments")}</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {[1, 7, 30, 90, 365].map(days => {
                                    // to keep track of the amount across the dates
                                    let accountBalance = safeKeepingValue;
                                    let totalPayment = 0;

                                    // go through the days to calculate historic change
                                    for (let day = 0; day < days; day++) {
                                        const thousands = accountBalance / 1000;
                                        let nextPayment = (thousands * 2.4) / 100;

                                        // update balance
                                        accountBalance = accountBalance - nextPayment;
                                        totalPayment = totalPayment + nextPayment;
                                    }

                                    return (
                                        <TableRow key={`days${days}`}>
                                            <TableCell component="th" scope="row">
                                                {days}
                                            </TableCell>
                                            <TableCell numeric>{formatMoney(totalPayment)}</TableCell>
                                            <TableCell numeric>{formatMoney(accountBalance)}</TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    );
                }

                businessInfo = (
                    <Paper style={styles.paper}>
                        <Grid container spacing={16} justify="center">
                            <Grid item xs={12}>
                                <TranslateTypography variant="subtitle1">
                                    Safekeeping fee calculator
                                </TranslateTypography>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    min={0}
                                    step={0.01}
                                    type="number"
                                    label="Total account balance"
                                    value={parseFloat(totalBalance ? totalBalance : 0).toFixed(2)}
                                    onChange={this.onChange("totalBalance")}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                {hasSafeKeepingFee ? (
                                    costsTable
                                ) : (
                                    <TranslateTypography variant="subtitle1">No safekeeping fee</TranslateTypography>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                );
            }

            content = (
                <React.Fragment>
                    <UploadFullscreen
                        BunqJSClient={this.props.BunqJSClient}
                        open={this.state.displayUploadScreen}
                        onComplete={this.handleFileUpload}
                        onClose={this.toggleFileUploadDialog}
                    />

                    <Paper style={styles.paper}>
                        <List>
                            <ListItem>
                                <Avatar
                                    style={{ ...styles.avatar, cursor: "pointer" }}
                                    onClick={_ =>
                                        this.setState({
                                            displayUploadScreen: true
                                        })
                                    }
                                >
                                    <LazyAttachmentImage
                                        BunqJSClient={this.props.BunqJSClient}
                                        height={70}
                                        imageUUID={user.avatar.image[0].attachment_public_uuid}
                                    />
                                </Avatar>
                                <ListItemText primary={user.public_nick_name} secondary={user.legal_name} />
                            </ListItem>
                        </List>

                        {this.state.normalizedUserInfo && (
                            <ProfileDetailsForm
                                initialValues={this.state.normalizedUserInfo}
                                onSubmit={this.updateSettings}
                            />
                        )}
                    </Paper>

                    {businessInfo}
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

const mapStateToProps = state => {
    return {
        user: state.user.user,
        userType: state.user.user_type,
        userLoading: state.user.loading,
        accounts: state.accounts.accounts,
        accountsLoading: state.accounts.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),
        usersUpdate: updated => dispatch(usersUpdate(BunqJSClient, updated)),
        userUpdateImage: (userId, attachmentId) => dispatch(userUpdateImage(BunqJSClient, userId, attachmentId)),

        BunqErrorHandler: (error, message) => BunqErrorHandler(dispatch, error, message)
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(Profile));
