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

import LazyAttachmentImage from "../Components/AttachmentImage/LazyAttachmentImage";
import NavLink from "../Components/Routing/NavLink";
import CombinedList from "../Components/CombinedList/CombinedList";
import AccountCard from "../Components/AccountCard";
import ButtonTranslate from "../Components/TranslationHelpers/Button";
import { filterShareInviteBankResponses, filterShareInviteBankInquiries } from "../Helpers/DataFilters";

import { openSnackbar } from "../Actions/snackbar";
import { accountsUpdate, accountsUpdateSettings, accountsDeactivate } from "../Actions/accounts";
import { paymentInfoUpdate } from "../Actions/payments";
import { requestResponsesUpdate } from "../Actions/request_responses";
import { bunqMeTabsUpdate } from "../Actions/bunq_me_tabs";
import { masterCardActionsUpdate } from "../Actions/master_card_actions";
import { requestInquiriesUpdate } from "../Actions/request_inquiries";
import { requestInquiryBatchesUpdate } from "../Actions/request_inquiry_batches";
import { shareInviteBankInquiriesInfoUpdate } from "../Actions/share_invite_bank_inquiries";
import { shareInviteBankResponsesInfoUpdate } from "../Actions/share_invite_bank_responses";

const styles = {
    chip: {
        margin: 8
    },
    chipImage: {
        width: 32,
        height: 32
    },
    textField: {
        width: "100%",
        marginTop: 16
    },
    paper: {
        padding: 24,
        marginBottom: 16
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

const PersonChip = ({ alias, BunqJSClient }) => {
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
            settingsDescription: "",
            settingsDailyLimit: 1000
        };
    }

    componentDidMount() {
        if (this.props.initialBunqConnect) {
            this.props.accountsUpdate(this.props.user.id);

            const userId = this.props.user.id;
            const accountId = parseFloat(this.props.match.params.accountId);

            if (this.props.limitedPermissions === false) {
                this.props.shareInviteBankInquiriesInfoUpdate(userId, accountId);
            }
            this.props.shareInviteBankResponsesInfoUpdate(userId);
            this.props.paymentsUpdate(userId, accountId);
            this.props.bunqMeTabsUpdate(userId, accountId);
            this.props.requestResponsesUpdate(userId, accountId);
            this.props.requestInquiriesUpdate(userId, accountId);
            this.props.requestInquiryBatchesUpdate(userId, accountId);
            this.props.masterCardActionsUpdate(userId, accountId);

            const accountInfo = this.props.accounts.find(account => account.id === accountId);
            if (accountInfo) {
                // found account info, set settings
                this.setState({
                    settingsColor: accountInfo.color,
                    settingsDescription: accountInfo.description,
                    settingsDailyLimit: parseFloat(accountInfo.daily_limit.value)
                });
            }
        }
    }

    getSnapshotBeforeUpdate(nextProps, nextState) {
        const { initialBunqConnect, accountsLoading, user } = this.props;
        const nextAccountId = parseFloat(nextProps.match.params.accountId);
        const accountId = parseFloat(this.props.match.params.accountId);

        if (accountsLoading === false && initialBunqConnect && nextAccountId !== accountId) {
            this.props.accountsUpdate(user.id);

            if (this.props.limitedPermissions === false) {
                this.props.shareInviteBankInquiriesInfoUpdate(user.id, nextAccountId);
            }
            this.props.shareInviteBankResponsesInfoUpdate(user.id);
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
        // send a deactivation request
        this.props.deactivateAccount(this.props.user.id, accountId, this.state.deactivateReason);
        // trigger redirect back home
        this.setState({ deactivateActivated: true });
    };

    toggleSettingsDialog = () => this.setState({ openSettingsDialog: !this.state.openSettingsDialog });
    handleColorChange = (color, event) => this.setState({ settingsColor: color.hex });
    handleDescriptionChange = event => this.setState({ settingsDescription: event.target.value });
    handleDailyLimitChange = event => {
        let inputLimit = event.target.value;
        if (inputLimit > 50000) inputLimit = 50000;
        if (inputLimit < 0) inputLimit = 0;

        this.setState({ settingsDailyLimit: parseFloat(inputLimit) });
    };

    editAccount = event => {
        if (this.state.settingsDescription.length <= 0) return null;

        // hide dialog
        this.toggleSettingsDialog();
        // get the account id
        const accountId = parseFloat(this.props.match.params.accountId);
        // get the current account settings
        const accountInfo = this.props.accounts.find(account => account.id === accountId);

        // fix daily limit if required
        let settingsDailyLimit = this.state.settingsDailyLimit;
        if (settingsDailyLimit > 50000) settingsDailyLimit = 50000;
        if (settingsDailyLimit <= 0) settingsDailyLimit = 0;

        // update settings
        this.props.updateSettings(this.props.user.id, accountInfo.id, {
            description: this.state.settingsDescription,
            daily_limit: {
                value: "" + settingsDailyLimit.toFixed(2),
                currency: "EUR"
            },
            setting: {
                color: this.state.settingsColor
            }
        });
    };

    render() {
        const { accounts, user, shareInviteBankResponses, shareInviteBankInquiries, t } = this.props;
        const accountId = parseFloat(this.props.match.params.accountId);

        const noneText = t("None");
        const sharedWithText = t("Shared with");
        const sharedByText = t("Shared by");
        const coOwnersText = t("Co-owners");

        if (this.state.deactivateActivated) return <Redirect to="/" />;

        const accountInfo = accounts.find(account => account.id === accountId);

        let content = null;
        if (accountInfo !== false) {
            const filteredInviteResponses = shareInviteBankResponses.filter(
                filterShareInviteBankResponses(accountInfo.id)
            );
            const filteredShareInquiries = shareInviteBankInquiries.filter(
                filterShareInviteBankInquiries(accountInfo.id)
            );

            const isJointAccount = accountInfo.accountType === "MonetaryAccountJoint";

            let primaryConnectText = sharedWithText;
            let profileIconList = [];
            let allowConnectSettings = true;

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
                        return (
                            <PersonChip
                                BunqJSClient={this.props.BunqJSClient}
                                alias={filteredInviteResponse.ShareInviteBankResponse.counter_alias}
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
                                alias={filteredShareInquiry.ShareInviteBankInquiry.counter_user_alias}
                            />
                        );
                    });
                }
            }

            const connectListItemText = (
                <ListItemText
                    primary={`${primaryConnectText}: `}
                    secondary={profileIconList.length === 0 ? noneText : ""}
                />
            );

            content = (
                <React.Fragment>
                    <Dialog open={this.state.openDialog} onClose={this.toggleDeactivateDialog}>
                        <DialogTitle>{t("Cancel account")}</DialogTitle>

                        <DialogContent>
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
                            <ButtonTranslate
                                variant="raised"
                                onClick={this.toggleDeactivateDialog}
                                color="primary"
                                autoFocus
                            >
                                Cancel
                            </ButtonTranslate>
                            <ButtonTranslate
                                variant="raised"
                                onClick={this.deactivateAccount}
                                color="secondary"
                                disabled={
                                    this.props.accountsLoading ||
                                    this.state.deactivateReason.length === 0 ||
                                    isJointAccount
                                }
                            >
                                Agree
                            </ButtonTranslate>
                        </DialogActions>
                    </Dialog>

                    <Dialog open={this.state.openSettingsDialog} onClose={this.toggleSettingsDialog}>
                        <DialogTitle>{t("Edit account settings")}</DialogTitle>

                        <DialogContent>
                            <CirclePicker
                                onChange={this.handleColorChange}
                                color={this.state.settingsColor}
                                style={styles.circlePicker}
                            />
                            <TextField
                                style={styles.textField}
                                value={this.state.settingsDescription}
                                onChange={this.handleDescriptionChange}
                                error={this.state.settingsDescription.length === 0}
                                placeholder={t("Account description")}
                            />
                            <TextField
                                style={styles.textField}
                                value={this.state.settingsDailyLimit}
                                onChange={this.handleDailyLimitChange}
                                type={"number"}
                                label={t("Daily limit")}
                                inputProps={{
                                    min: 0,
                                    max: 50000
                                }}
                            />
                        </DialogContent>

                        <DialogActions>
                            <ButtonTranslate
                                variant="raised"
                                onClick={this.toggleSettingsDialog}
                                color="secondary"
                                autoFocus
                            >
                                Cancel
                            </ButtonTranslate>
                            <ButtonTranslate
                                variant="raised"
                                onClick={this.editAccount}
                                disabled={this.props.accountsLoading || this.state.settingsDescription.length === 0}
                                color="primary"
                            >
                                Update
                            </ButtonTranslate>
                        </DialogActions>
                    </Dialog>

                    <AccountCard
                        BunqJSClient={this.props.BunqJSClient}
                        openSnackbar={this.props.openSnackbar}
                        hideBalance={this.props.hideBalance}
                        toggleSettingsDialog={this.toggleSettingsDialog}
                        toggleDeactivateDialog={this.toggleDeactivateDialog}
                        shareInviteBankResponses={filteredInviteResponses}
                        account={accountInfo}
                        isJoint={isJointAccount}
                    />

                    <Paper style={styles.paperIcons}>
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

                    <Paper style={styles.paperList}>
                        <CombinedList
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                            hiddenTypes={["ShareInviteBankInquiry"]}
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

        shareInviteBankResponses: state.share_invite_bank_responses.share_invite_bank_responses,
        shareInviteBankResponsesLoading: state.share_invite_bank_responses.loading,

        shareInviteBankInquiries: state.share_invite_bank_inquiries.share_invite_bank_inquiries,
        shareInviteBankInquiriesLoading: state.share_invite_bank_inquiries.loading,

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
        deactivateAccount: (userId, accountId, reason) =>
            dispatch(accountsDeactivate(BunqJSClient, userId, accountId, reason)),
        updateSettings: (userId, accountId, settings) =>
            dispatch(accountsUpdateSettings(BunqJSClient, userId, accountId, settings)),

        shareInviteBankInquiriesInfoUpdate: (userId, accountId) =>
            dispatch(shareInviteBankInquiriesInfoUpdate(BunqJSClient, userId, accountId)),
        shareInviteBankResponsesInfoUpdate: (userId, accountId) =>
            dispatch(shareInviteBankResponsesInfoUpdate(BunqJSClient, userId)),
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(AccountInfo));
