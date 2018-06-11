import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Redirect from "react-router-dom/Redirect";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ConnectListItem from "./ConnectListItem";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import TypographyTranslate from "../../Components/TranslationHelpers/Typography";
import {
    filterShareInviteBankInquiries,
    filterShareInviteBankResponses
} from "../../Helpers/Filters";

import { shareInviteBankResponsesInfoUpdate } from "../../Actions/share_invite_bank_response";
import { shareInviteBankInquiriesInfoUpdate } from "../../Actions/share_invite_bank_inquiry";
import { openSnackbar } from "../../Actions/snackbar";
import {accountsUpdate} from "../../Actions/accounts";

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

    componentDidMount() {
        if (this.props.initialBunqConnect) {
            this.props.accountsUpdate(this.props.user.id);

            const userId = this.props.user.id;
            const accountId = parseFloat(this.props.match.params.accountId);

            this.props.shareInviteBankInquiriesInfoUpdate(userId, accountId);
            this.props.shareInviteBankResponsesInfoUpdate(userId);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const { initialBunqConnect, accountsLoading, user } = nextProps;
        const accountId = parseFloat(this.props.match.params.accountId);
        const nextAccountId = parseFloat(nextProps.match.params.accountId);

        if (
            accountsLoading === false &&
            initialBunqConnect &&
            nextAccountId !== accountId
        ) {
            this.props.accountsUpdate(user.id);

            this.props.shareInviteBankInquiriesInfoUpdate(
                user.id,
                nextAccountId
            );
            this.props.shareInviteBankResponsesInfoUpdate(user.id);
        }
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
        const {
            accounts,
            shareInviteBankResponses,
            shareInviteBankInquiries,
            t
        } = this.props;
        const accountId = parseFloat(this.props.match.params.accountId);

        if (!accountId) return <Redirect to="/" />;

        const accountInfo = accounts.find(account => account.id === accountId);

        if (!accountInfo) return <Redirect to="/" />;

        const filteredInviteResponses = shareInviteBankResponses.filter(
            filterShareInviteBankResponses(accountInfo.id)
        );
        const filteredInviteInquiries = shareInviteBankInquiries.filter(
            filterShareInviteBankInquiries(accountInfo.id)
        );

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Connect`}</title>
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

                <Grid item xs={12} />

                <Grid item xs={12} md={6}>
                    {filteredInviteResponses.length > 0 ||
                    filteredInviteInquiries.length > 0 ? (
                        <Grid container spacing={8}>
                            <Grid item xs={12} sm={6}>
                                <Paper style={styles.paperList}>
                                    <List dense>
                                        <ListSubHeader>
                                            Shared With:
                                        </ListSubHeader>
                                        {filteredInviteInquiries.map(
                                            filteredInviteInquiry => (
                                                <ConnectListItem
                                                    t={t}
                                                    connectInfo={
                                                        filteredInviteInquiry.ShareInviteBankInquiry
                                                    }
                                                    BunqJSClient={
                                                        this.props.BunqJSClient
                                                    }
                                                />
                                            )
                                        )}
                                    </List>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Paper style={styles.paperList}>
                                    <List dense>
                                        <ListSubHeader>
                                            Shared By:
                                        </ListSubHeader>
                                        {filteredInviteResponses.map(
                                            filteredInviteResponse => (
                                                <ConnectListItem
                                                    t={t}
                                                    connectInfo={
                                                        filteredInviteResponse.ShareInviteBankResponse
                                                    }
                                                    BunqJSClient={
                                                        this.props.BunqJSClient
                                                    }
                                                />
                                            )
                                        )}
                                    </List>
                                </Paper>
                            </Grid>
                        </Grid>
                    ) : null}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,

        shareInviteBankResponses:
            state.share_invite_bank_responses.share_invite_bank_responses,
        shareInviteBankResponsesLoading:
            state.share_invite_bank_responses.loading,

        shareInviteBankInquiries:
            state.share_invite_bank_inquiries.share_invite_bank_inquiries,
        shareInviteBankInquiriesLoading:
            state.share_invite_bank_inquiries.loading,

        accounts: state.accounts.accounts,
        accountsLoading: state.accounts.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),

        accountsUpdate: userId =>
            dispatch(accountsUpdate(BunqJSClient, userId)),

        shareInviteBankInquiriesInfoUpdate: (userId, accountId) =>
            dispatch(
                shareInviteBankInquiriesInfoUpdate(
                    BunqJSClient,
                    userId,
                    accountId
                )
            ),
        shareInviteBankResponsesInfoUpdate: (userId, accountId) =>
            dispatch(shareInviteBankResponsesInfoUpdate(BunqJSClient, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Connect)
);
