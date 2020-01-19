import React from "react";
import { translate } from "react-i18next";
import Redirect from "react-router-dom/Redirect";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import CirclePicker from "react-color/lib/Circle";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import TextField from "@material-ui/core/TextField";
import FormControl from "@material-ui/core/FormControl";
import CircularProgress from "@material-ui/core/CircularProgress";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import TranslateTypography from "../Components/TranslationHelpers/Typography";
import LazyAttachmentImage from "../Components/AttachmentImage/LazyAttachmentImage";
import NavLink from "../Components/Routing/NavLink";
import CombinedList from "../Components/CombinedList/CombinedList";
import AccountCard from "../Components/AccountCard";
import TranslateButton from "../Components/TranslationHelpers/Button";
import MoneyFormatInput from "../Components/FormFields/MoneyFormatInput";

import { filterShareInviteMonetaryAccountResponses, filterShareInviteBankInquiries } from "../Functions/DataFilters";

import { openSnackbar } from "../Actions/snackbar";
import { accountsUpdate, accountsUpdateSettings, accountsDeactivate } from "../Actions/accounts";
import { paymentInfoUpdate } from "../Actions/payments";
import { requestResponsesUpdate } from "../Actions/request_responses";
import { bunqMeTabsUpdate } from "../Actions/bunq_me_tabs";
import { masterCardActionsUpdate } from "../Actions/master_card_actions";
import { requestInquiriesUpdate } from "../Actions/request_inquiries";
import { requestInquiryBatchesUpdate } from "../Actions/request_inquiry_batches";
import { shareInviteMonetaryAccountInquiriesInfoUpdate } from "../Actions/share_invite_monetary_account_inquiries";
import { shareInviteMonetaryAccountResponsesInfoUpdate } from "../Actions/share_invite_monetary_account_responses";
import { shareInviteMonetaryAccountResponseChangeStatus } from "../Actions/share_invite_monetary_account_response";
import { shareInviteMonetaryAccountInquiryChangeStatus } from "../Actions/share_invite_monetary_account_inquiry";
import { connectGetPermissions } from "../Functions/ConnectGetPermissions";

const styles = {
    paper: {
        padding: 24,
        marginBottom: 16
    },
    dialogContent: {
        width: 240
    },
    chip: {
        margin: 8
    },
    chipImage: {
        width: 32,
        height: 32
    },
    formControl: {
        marginTop: 16
    },
    textField: {
        width: "100%",
        marginTop: 16
    },
    paperIcons: {
        marginTop: 16,
        padding: 8
    },
    paperList: {
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

const PersonChip = ({ alias, BunqJSClient, ...otherProps }) => {
    return (
        <Chip
            style={styles.chip}
            avatar={
                <Avatar>
                    <LazyAttachmentImage
                        style={styles.chipImage}
                        BunqJSClient={BunqJSClient}
                        height={32}
                        imageUUID={alias.avatar.image[0].attachment_public_uuid}
                    />
                </Avatar>
            }
            label={alias.display_name}
            {...otherProps}
        />
    );
};

class AccountInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            openDialog: false,
            deactivateReason: "I no longer need this account",
            deactivateActivated: false,

            openSettingsDialog: false,
            settingsColor: "#ffffff",
            settingsDailyLimit: 1000,
            settingsDescription: "",
            settingsSavingsGoal: 1000,

            settingsValidForm: false,
            settingsDailyLimitError: false,
            settingsDescriptionError: false,
            settingsSavingsGoalError: false
        };
    }

    componentDidMount() {
        if (this.props.registrationReady) {
            this.props.accountsUpdate(this.props.user.id);

            const userId = this.props.user.id;
            const accountId = parseFloat(this.props.match.params.accountId);

            if (this.props.limitedPermissions === false) {
                this.props.shareInviteMonetaryAccountInquiriesInfoUpdate(userId, accountId);
            }
            this.props.shareInviteMonetaryAccountResponsesInfoUpdate(userId);
            const connectPermissions = connectGetPermissions(this.props.shareInviteMonetaryAccountResponses, accountId);
            if (connectPermissions && connectPermissions.view_new_events) {
                this.props.paymentsUpdate(userId, accountId);
                this.props.bunqMeTabsUpdate(userId, accountId);
                this.props.requestResponsesUpdate(userId, accountId);
                this.props.requestInquiriesUpdate(userId, accountId);
                this.props.requestInquiryBatchesUpdate(userId, accountId);
                this.props.masterCardActionsUpdate(userId, accountId);
            }

            const accountInfo = this.props.accounts.find(account => account.id === accountId);
            if (accountInfo) {
                // found account info, set settings
                this.setState({
                    settingsColor: accountInfo.color,
                    settingsDescription: accountInfo.description,
                    settingsDailyLimit: parseFloat(accountInfo.daily_limit.value)
                });

                if (accountInfo.accountType === "MonetaryAccountSavings") {
                    this.setState({
                        settingsSavingsGoal: parseFloat(accountInfo.savings_goal.value)
                    });
                }
            }
        }
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        const { registrationReady, accountsLoading, user } = this.props;
        const nextAccountId = parseFloat(nextProps.match.params.accountId);
        const accountId = parseFloat(this.props.match.params.accountId);

        if (accountsLoading === false && registrationReady && nextAccountId !== accountId) {
            this.props.accountsUpdate(user.id);

            if (this.props.limitedPermissions === false) {
                this.props.shareInviteMonetaryAccountInquiriesInfoUpdate(user.id, nextAccountId);
            }
            this.props.shareInviteMonetaryAccountResponsesInfoUpdate(user.id);
            this.props.paymentsUpdate(user.id, nextAccountId);
            this.props.bunqMeTabsUpdate(user.id, nextAccountId);
            this.props.requestResponsesUpdate(user.id, nextAccountId);
            this.props.requestInquiriesUpdate(user.id, nextAccountId);
            this.props.masterCardActionsUpdate(user.id, nextAccountId);
        }
        return null;
    }
    componentDidUpdate() {}

    toggleDeactivateDialog = () => this.setState({ openDialog: !this.state.openDialog });
    handleReasonChange = event => {
        this.setState({ deactivateReason: event.target.value });
    };
    deactivateAccount = event => {
        // hide dialog
        this.toggleDeactivateDialog();

        // get the account id
        const accountId = parseFloat(this.props.match.params.accountId);
        const accountInfo = this.props.accounts.find(account => account.id === accountId);

        if (!accountInfo) return;

        // send a deactivation request
        this.props.deactivateAccount(
            this.props.user.id,
            accountId,
            this.state.deactivateReason,
            accountInfo.accountType
        );
        // trigger redirect back home
        this.setState({ deactivateActivated: true });
    };

    toggleSettingsDialog = () =>
        this.setState({ openSettingsDialog: !this.state.openSettingsDialog }, this.validateForm);
    handleColorChange = color => this.setState({ settingsColor: color.hex }, this.validateForm);
    handleDescriptionChange = event => this.setState({ settingsDescription: event.target.value }, this.validateForm);
    handleChangeFormatted = name => valueObject => {
        this.setState(
            {
                [name]: valueObject.formattedValue.length > 0 ? valueObject.floatValue : ""
            },
            this.validateForm
        );
    };

    validateForm = () => {
        const { accounts } = this.props;
        const { settingsDescription, settingsDailyLimit, settingsSavingsGoal } = this.state;
        const accountId = parseFloat(this.props.match.params.accountId);
        const accountInfo = accounts.find(account => account.id === accountId);

        let savingsGoalError = false;
        if (accountInfo.accountType === "MonetaryAccountSavings") {
            if (!settingsSavingsGoal) {
                savingsGoalError = settingsSavingsGoal < 0.01 || settingsSavingsGoal > 100000;
            }
        }
        const limitErrorCondition = settingsDailyLimit < 0.01 || settingsDailyLimit > 100000;
        const descriptionErrorCondition = settingsDescription.length < 1 || settingsDescription.length > 140;

        this.setState({
            settingsDailyLimitError: limitErrorCondition,
            settingsDescriptionError: descriptionErrorCondition,
            settingsValidForm: !limitErrorCondition && !descriptionErrorCondition && !savingsGoalError,
            settingsSavingsGoalError: savingsGoalError
        });
    };

    editAccount = event => {
        if (this.state.settingsDescription.length <= 0) return null;

        // hide dialog
        this.toggleSettingsDialog();

        // get the account id
        const accountId = parseFloat(this.props.match.params.accountId);
        const accountInfo = this.props.accounts.find(account => account.id === accountId);

        if (!accountInfo) return;

        const requestBody = {
            description: this.state.settingsDescription,
            daily_limit: {
                value: this.state.settingsDailyLimit + "",
                currency: "EUR"
            },
            setting: {
                color: this.state.settingsColor
            }
        };

        if (accountInfo.accountType === "MonetaryAccountSavings") {
            requestBody.savings_goal = {
                currency: "EUR",
                value: this.state.settingsSavingsGoal + ""
            };
        }

        // update settings
        this.props.updateSettings(this.props.user.id, accountInfo.id, requestBody, accountInfo.accountType);
    };

    render() {
        const {
            t,
            accounts,
            user,
            shareInviteMonetaryAccountResponses,
            shareInviteBankInquiries,
            limitedPermissions
        } = this.props;
        const accountId = parseFloat(this.props.match.params.accountId);

        const noneText = t("None");
        const sharedWithText = t("Shared with");
        const sharedByText = t("Shared by");
        const coOwnersText = t("Co-owners");

        if (this.state.deactivateActivated) return <Redirect to="/" />;

        const accountInfo = accounts.find(account => account.id === accountId);

        let content = null;
        let isSavingsAccount = false;
        let isJointAccount = false;
        if (accountInfo !== false) {
            isSavingsAccount = accountInfo.accountType === "MonetaryAccountSavings";
            isJointAccount = accountInfo.accountType === "MonetaryAccountJoint";

            const filteredInviteResponses = shareInviteMonetaryAccountResponses.filter(
                filterShareInviteMonetaryAccountResponses(accountInfo.id)
            );
            const filteredShareInquiries = shareInviteBankInquiries.filter(
                filterShareInviteBankInquiries(accountInfo.id)
            );

            let primaryConnectText = sharedWithText;
            let profileIconList = [];
            let allowConnectSettings = !limitedPermissions;

            // don't render if on a joint account
            if (isJointAccount) {
                primaryConnectText = coOwnersText;
                allowConnectSettings = false;

                profileIconList = accountInfo.all_co_owner
                    .filter(coOwner => {
                        return coOwner.alias.uuid !== user.avatar.anchor_uuid;
                    })
                    .map(coOwner => {
                        return <PersonChip BunqJSClient={this.props.BunqJSClient} alias={coOwner.alias} />;
                    });
            } else {
                if (filteredInviteResponses.length > 0) {
                    // this account was shared by someone
                    primaryConnectText = sharedByText;
                    allowConnectSettings = false;

                    profileIconList = filteredInviteResponses.map(filteredInviteResponse => {
                        if (!filteredInviteResponse || !filteredInviteResponse.ShareInviteMonetaryAccountResponse)
                            return null;
                        return (
                            <PersonChip
                                BunqJSClient={this.props.BunqJSClient}
                                alias={filteredInviteResponse.ShareInviteMonetaryAccountResponse.counter_alias}
                                onDelete={e => {
                                    this.props.shareInviteMonetaryAccountResponseChangeStatus(
                                        this.props.user.id,
                                        filteredInviteResponse.ShareInviteMonetaryAccountResponse.id,
                                        "CANCELLED"
                                    );
                                }}
                            />
                        );
                    });
                } else if (filteredShareInquiries.length > 0) {
                    // this account was shared with someone
                    primaryConnectText = sharedWithText;

                    profileIconList = filteredShareInquiries.map(filteredShareInquiry => {
                        return (
                            <PersonChip
                                BunqJSClient={this.props.BunqJSClient}
                                alias={filteredShareInquiry.ShareInviteMonetaryAccountInquiry.counter_user_alias}
                                onDelete={e => {
                                    this.props.shareInviteMonetaryAccountInquiryChangeStatus(
                                        this.props.user.id,
                                        filteredShareInquiry.ShareInviteMonetaryAccountInquiry.monetary_account_id,
                                        filteredShareInquiry.ShareInviteMonetaryAccountInquiry.id,
                                        "CANCELLED"
                                    );
                                }}
                            />
                        );
                    });
                }
            }

            let connectComponent = null;
            if (isSavingsAccount === false) {
                const connectListItemText = (
                    <ListItemText
                        primary={`${primaryConnectText}: `}
                        secondary={profileIconList.length === 0 ? noneText : ""}
                    />
                );

                connectComponent = (
                    <Paper key="connect-paper" style={styles.paperIcons}>
                        <List dense={true}>
                            {allowConnectSettings ? (
                                <ListItem to={`/connect/${accountId}`} component={NavLink} button>
                                    {connectListItemText}
                                </ListItem>
                            ) : (
                                <ListItem>{connectListItemText}</ListItem>
                            )}
                        </List>

                        {profileIconList}
                    </Paper>
                );
            }

            const accountCardProps = {
                account: accountInfo,
                isJointAccount: isJointAccount,
                isSavingsAccount: isSavingsAccount,
                filteredInviteResponses: filteredInviteResponses,
                toggleSettingsDialog: filteredInviteResponses.length > 0 ? false : this.toggleSettingsDialog,
                toggleDeactivateDialog: filteredInviteResponses.length > 0 ? false : this.toggleDeactivateDialog
            };

            content = (
                <React.Fragment>
                    <Dialog key="deactivate-dialog" open={this.state.openDialog} onClose={this.toggleDeactivateDialog}>
                        <DialogTitle>{t("Cancel account")}</DialogTitle>

                        <DialogContent style={styles.dialogContent}>
                            <DialogContentText>
                                {isJointAccount
                                    ? t("It is not possible to delete a Joint or Connect account using bunqDesktop")
                                    : t("Are you sure you wish to cancel this account?")}
                            </DialogContentText>
                            <TextField
                                style={styles.textField}
                                value={this.state.deactivateReason}
                                onChange={this.handleReasonChange}
                                error={this.state.deactivateReason.length === 0}
                                disabled={isJointAccount}
                                helperText={t("Why are you closing the account?")}
                                placeholder={t("Reason")}
                            />
                        </DialogContent>

                        <DialogActions>
                            <TranslateButton
                                variant="contained"
                                onClick={this.toggleDeactivateDialog}
                                color="primary"
                                autoFocus
                            >
                                Cancel
                            </TranslateButton>
                            <TranslateButton
                                variant="contained"
                                onClick={this.deactivateAccount}
                                color="secondary"
                                disabled={
                                    this.props.accountsLoading ||
                                    this.state.deactivateReason.length === 0 ||
                                    isJointAccount
                                }
                            >
                                Agree
                            </TranslateButton>
                        </DialogActions>
                    </Dialog>

                    <Dialog
                        key="settings-dialog"
                        open={this.state.openSettingsDialog}
                        onClose={this.toggleSettingsDialog}
                    >
                        <DialogTitle>{t("Edit account settings")}</DialogTitle>

                        <DialogContent style={styles.dialogContent}>
                            <CirclePicker
                                onChange={this.handleColorChange}
                                color={this.state.settingsColor}
                                style={styles.circlePicker}
                            />

                            <TextField
                                label={t("Account description")}
                                style={styles.textField}
                                value={this.state.settingsDescription}
                                onChange={this.handleDescriptionChange}
                                error={this.state.settingsDescriptionError}
                            />

                            <FormControl error={this.state.settingsDailyLimitError} style={styles.formControl}>
                                <TranslateTypography type="body2">Daily limit</TranslateTypography>
                                <MoneyFormatInput
                                    id="savings-goal"
                                    onValueChange={this.handleChangeFormatted("settingsDailyLimit")}
                                    value={this.state.settingsDailyLimit}
                                />
                            </FormControl>

                            {accountInfo.accountType === "MonetaryAccountSavings" && (
                                <FormControl error={this.state.settingsSavingsGoalError} style={styles.formControl}>
                                    <TranslateTypography type="body2">Savings goal</TranslateTypography>
                                    <MoneyFormatInput
                                        id="savings-goal"
                                        onValueChange={this.handleChangeFormatted("settingsSavingsGoal")}
                                        value={this.state.settingsSavingsGoal}
                                    />
                                </FormControl>
                            )}
                        </DialogContent>

                        <DialogActions>
                            <TranslateButton
                                variant="contained"
                                onClick={this.toggleSettingsDialog}
                                color="secondary"
                                autoFocus
                            >
                                Cancel
                            </TranslateButton>
                            <TranslateButton
                                variant="contained"
                                onClick={this.editAccount}
                                disabled={this.props.accountsLoading || this.state.settingsValidForm === false}
                                color="primary"
                            >
                                Update
                            </TranslateButton>
                        </DialogActions>
                    </Dialog>

                    <AccountCard
                        key="account-card"
                        BunqJSClient={this.props.BunqJSClient}
                        openSnackbar={this.props.openSnackbar}
                        hideBalance={this.props.hideBalance}
                        {...accountCardProps}
                    />

                    {connectComponent}

                    <Paper key="combinedlist-paper" style={styles.paperList}>
                        <CombinedList
                            BunqJSClient={this.props.BunqJSClient}
                            hiddenTypes={["ShareInviteMonetaryAccountInquiry"]}
                            accountId={accountId}
                            displayRequestPayments={false}
                            displayAcceptedRequests={true}
                        />
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
                    <title>{`bunqDesktop - ${t("Account Info")}`}</title>
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
        hideBalance: state.options.hide_balance,

        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses,
        shareInviteMonetaryAccountResponsesLoading: state.share_invite_monetary_account_responses.loading,

        shareInviteBankInquiries: state.share_invite_monetary_account_inquiries.share_invite_monetary_account_inquiries,
        shareInviteBankInquiriesLoading: state.share_invite_monetary_account_inquiries.loading,

        user: state.user.user,
        limitedPermissions: state.user.limited_permissions,

        accounts: state.accounts.accounts,
        accountsLoading: state.accounts.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),

        accountsUpdate: userId => dispatch(accountsUpdate(BunqJSClient, userId)),
        deactivateAccount: (userId, accountId, reason, accountType) =>
            dispatch(accountsDeactivate(BunqJSClient, userId, accountId, reason, accountType)),
        updateSettings: (userId, accountId, settings, accountType) =>
            dispatch(accountsUpdateSettings(BunqJSClient, userId, accountId, settings, accountType)),

        shareInviteMonetaryAccountResponseChangeStatus: (userId, shareInviteMonetaryAccountResponseId, status) =>
            dispatch(
                shareInviteMonetaryAccountResponseChangeStatus(
                    BunqJSClient,
                    userId,
                    shareInviteMonetaryAccountResponseId,
                    status
                )
            ),
        shareInviteMonetaryAccountInquiryChangeStatus: (
            userId,
            accountId,
            shareInviteMonetaryAccountInquiryId,
            status
        ) =>
            dispatch(
                shareInviteMonetaryAccountInquiryChangeStatus(
                    BunqJSClient,
                    userId,
                    accountId,
                    shareInviteMonetaryAccountInquiryId,
                    status
                )
            ),

        shareInviteMonetaryAccountInquiriesInfoUpdate: (userId, accountId) =>
            dispatch(shareInviteMonetaryAccountInquiriesInfoUpdate(BunqJSClient, userId, accountId)),
        shareInviteMonetaryAccountResponsesInfoUpdate: (userId, accountId) =>
            dispatch(shareInviteMonetaryAccountResponsesInfoUpdate(BunqJSClient, userId)),
        paymentsUpdate: (userId, accountId) => dispatch(paymentInfoUpdate(BunqJSClient, userId, accountId)),
        requestInquiriesUpdate: (userId, accountId) =>
            dispatch(requestInquiriesUpdate(BunqJSClient, userId, accountId)),
        requestInquiryBatchesUpdate: (userId, accountId) =>
            dispatch(requestInquiryBatchesUpdate(BunqJSClient, userId, accountId)),
        requestResponsesUpdate: (userId, accountId) =>
            dispatch(requestResponsesUpdate(BunqJSClient, userId, accountId)),
        masterCardActionsUpdate: (userId, accountId) =>
            dispatch(masterCardActionsUpdate(BunqJSClient, userId, accountId)),
        bunqMeTabsUpdate: (userId, accountId) => dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(AccountInfo));
