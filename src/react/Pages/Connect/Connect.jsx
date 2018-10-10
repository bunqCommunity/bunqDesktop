import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Redirect from "react-router-dom/Redirect";
import EmailValidator from "email-validator";
import format from "date-fns/format";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import BudgetFields from "./BudgetFields";
import TimeLimitFields from "./TimeLimitFields";
import ConnectListItem from "./ConnectListItem";
import ConnectSettingItem from "./ConnectSettingItem";
import AccountListItem from "../../Components/AccountList/AccountListItem";
import TargetSelection from "../../Components/FormFields/TargetSelection";
import TypographyTranslate from "../../Components/TranslationHelpers/Typography";
import ButtonTranslate from "../../Components/TranslationHelpers/Button";
import FullAccess from "../../Components/ListItems/ShareInviteBankTypes/FullAccess";
import DraftAccess from "../../Components/ListItems/ShareInviteBankTypes/DraftAccess";
import ShowOnly from "../../Components/ListItems/ShareInviteBankTypes/ShowOnly";

import { filterShareInviteBankInquiries, filterShareInviteBankResponses } from "../../Helpers/DataFilters";
import { getInternationalFormat, isValidPhonenumber } from "../../Helpers/PhoneLib";
import { getUTCDate } from "../../Helpers/Utils";

import { shareInviteBankResponsesInfoUpdate } from "../../Actions/share_invite_bank_responses";
import { shareInviteBankInquiriesInfoUpdate } from "../../Actions/share_invite_bank_inquiries";
import { shareInviteBankInquirySend } from "../../Actions/share_invite_bank_inquiry";
import { accountsUpdate } from "../../Actions/accounts";
import { openSnackbar } from "../../Actions/snackbar";

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
            // access level selection from the radio buttons
            accessLevel: "full",

            // budget enabled/disabled and the actual value
            setBudget: false,
            budget: 100,
            budgetError: false,
            budgetFrequency: "ONCE",

            // connect settings
            displaySettings: false,
            make_payments: true,
            make_draft_payments: true,
            view_balance: true,
            view_new_events: true,
            view_old_events: false,

            // time limit enabled status and actual value
            setTimeLimit: false,
            timeLimit: null,

            // valid form status after checking all options
            validForm: false,

            // default target field
            targetError: false,
            target: "",

            // a list with all the targets
            targets: [],

            // defines which type is used
            targetType: "CONTACT"
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
        }
        return null;
    }
    componentDidUpdate() {}

    handleChange = name => event => {
        this.setState(
            {
                [name]: event.target.value
            },
            () => {
                this.validateForm();
                this.validateTargetInput();
            }
        );
    };
    handleChangeDirect = name => value => {
        this.setState(
            {
                [name]: value
            },
            () => {
                this.validateForm();
                this.validateTargetInput();
            }
        );
    };
    handleChangeFormatted = name => valueObject => {
        this.setState(
            {
                [name]: valueObject.formattedValue.length > 0 ? valueObject.floatValue : ""
            },
            () => {
                this.validateForm();
                this.validateTargetInput();
            }
        );
    };

    // add a target from the current text inputs to the target list
    addTarget = () => {
        this.validateTargetInput(valid => {
            // target is valid, add it to the list
            if (valid) {
                let targetValue = this.state.target.trim();

                if (isValidPhonenumber(targetValue)) {
                    // valid phone number, we must format as international
                    targetValue = getInternationalFormat(targetValue);
                }

                this.setState(
                    {
                        // set the new target list
                        targets: [
                            {
                                type: this.state.targetType,
                                value: targetValue,
                                name: ""
                            }
                        ],
                        // reset the input
                        target: ""
                    },
                    () => {
                        this.validateForm();
                        this.validateTargetInput();
                    }
                );
            }
        });
    };

    // remove a key from the target list
    removeTarget = key => {
        const newTargets = [...this.state.targets];
        if (newTargets[key]) {
            newTargets.splice(key, 1);
            this.setState(
                {
                    targets: newTargets
                },
                () => {
                    this.validateForm();
                    this.validateTargetInput();
                }
            );
        }
    };

    // validate only the taret inputs
    validateTargetInput = (callback = () => {}) => {
        const { target, targetType } = this.state;

        // check if the target is valid based onthe targetType
        let targetErrorCondition = false;
        switch (targetType) {
            case "CONTACT":
                const validEmail = EmailValidator.validate(target);
                const validPhone = isValidPhonenumber(target);

                // only error if both are false
                targetErrorCondition = !validEmail && !validPhone;
                break;
        }

        this.setState(
            {
                targetError: targetErrorCondition
            },
            () => callback(!targetErrorCondition)
        );
    };

    // callbacks for input fields and selectors
    setTargetType = type => event => {
        this.setState({
            targetType: type,
            target: ""
        });
    };

    validateForm = () => {
        const { budget, target, targets, targetType, timeLimit, setTimeLimit } = this.state;

        const budgetErrorCondition = budget < 0.01 || budget > 10000;
        const timeLimitError = setTimeLimit === true && timeLimit === null;

        // check if the target is valid based onthe targetType
        let targetErrorCondition = false;
        switch (targetType) {
            case "CONTACT":
                const validEmail = EmailValidator.validate(target);
                const validPhone = isValidPhonenumber(target);

                // only error if both are false
                targetErrorCondition = !validEmail && !validPhone;
                break;
        }

        this.setState({
            budgetError: budgetErrorCondition,
            validForm: !budgetErrorCondition && !timeLimitError && targets.length > 0
        });
    };

    sendConnectRequest = event => {
        if (!this.props.shareInviteBankInquiryLoading) {
            let shareDetail;
            let shareOptions;

            // set timelimit if set
            if (this.state.accessLevel !== "draft" && this.state.setTimeLimit) {
                const timeFormatted = format(getUTCDate(this.state.timeLimit), "YYYY-MM-dd HH:mm:ss");
                shareOptions = {
                    end_date: timeFormatted
                };
            }

            switch (this.state.accessLevel) {
                case "full":
                    shareDetail = {
                        ShareDetailPayment: {
                            make_payments: this.state.make_payments,
                            make_draft_payments: this.state.make_draft_payments,
                            view_balance: this.state.view_balance,
                            view_old_events: this.state.view_old_events,
                            view_new_events: this.state.view_new_events
                        }
                    };

                    if (this.state.setBudget) {
                        // set the budget
                        shareDetail.ShareDetailPayment.budget = {
                            amount: {
                                value: this.state.budget.toFixed(2) + "",
                                currency: "EUR"
                            }
                        };

                        // setup frequency for the budget if not once
                        if (this.state.budgetFrequency !== "ONCE") {
                            shareDetail.ShareDetailPayment.budget.frequency = this.state.budgetFrequency;
                        }
                    }
                    break;
                case "draft":
                    shareDetail = {
                        ShareDetailDraftPayment: {
                            make_draft_payments: this.state.make_draft_payments,
                            view_balance: this.state.view_balance,
                            view_old_events: this.state.view_old_events,
                            view_new_events: this.state.view_new_events
                        }
                    };
                    break;
                case "showOnly":
                    shareDetail = {
                        ShareDetailReadOnly: {
                            view_balance: this.state.view_balance,
                            view_old_events: this.state.view_old_events,
                            view_new_events: this.state.view_new_events
                        }
                    };
                    break;
            }

            let targetInfo = false;
            if (this.state.targets.length > 0) {
                const target = this.state.targets.pop();
                const validEmail = EmailValidator.validate(target.value);
                const validPhone = isValidPhonenumber(target.value);

                if (validEmail) {
                    targetInfo = {
                        type: "EMAIL",
                        value: target.value.trim()
                    };
                } else if (validPhone) {
                    const formattedNumber = getInternationalFormat(target.value);
                    if (formattedNumber) {
                        targetInfo = {
                            type: "PHONE_NUMBER",
                            value: formattedNumber
                        };
                    }
                }
            }

            // no correct target, do nothing
            if (!targetInfo) return null;

            this.props.shareInviteBankInquirySend(
                this.props.user.id,
                this.props.selectedAccountId,
                targetInfo,
                shareDetail,
                shareOptions
            );
        }
    };

    render() {
        const { accounts, shareInviteBankResponses, shareInviteBankInquiries, t } = this.props;

        const accountId = parseFloat(this.props.match.params.accountId);
        if (!accountId) return <Redirect to="/" />;

        const accountInfo = accounts.find(account => account.id === accountId);
        if (!accountInfo) return <Redirect to="/" />;

        const filteredInviteResponses = shareInviteBankResponses.filter(filterShareInviteBankResponses(accountInfo.id));
        const filteredInviteInquiries = shareInviteBankInquiries.filter(filterShareInviteBankInquiries(accountInfo.id));

        const accessLevelForm = (
            <List>
                <ListSubheader>Access level</ListSubheader>
                <FullAccess
                    t={t}
                    secondaryActions={
                        <Radio
                            value={"full"}
                            onChange={this.handleChange("accessLevel")}
                            checked={this.state.accessLevel === "full"}
                        />
                    }
                />
                <DraftAccess
                    t={t}
                    secondaryActions={
                        <Radio
                            value={"draft"}
                            onChange={this.handleChange("accessLevel")}
                            checked={this.state.accessLevel === "draft"}
                        />
                    }
                />
                <ShowOnly
                    t={t}
                    secondaryActions={
                        <Radio
                            value={"showOnly"}
                            onChange={this.handleChange("accessLevel")}
                            checked={this.state.accessLevel === "showOnly"}
                        />
                    }
                />
            </List>
        );

        return (
            <Grid container spacing={16} justify="center">
                <Helmet>
                    <title>{`bunqDesktop - Connect`}</title>
                </Helmet>

                <Grid item xs={12} sm={12} md={2} lg={3}>
                    <Button onClick={this.props.history.goBack} style={styles.btn}>
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={12} md={5} lg={6}>
                    <Paper style={styles.paper}>
                        <TypographyTranslate variant="h5" style={{ marginBottom: "25px" }}>
                            Send a Connect request
                        </TypographyTranslate>

                        <List dense>
                            <AccountListItem account={accountInfo} clickable={false} />
                        </List>

                        <TargetSelection
                            targetType={this.state.targetType}
                            targets={this.state.targets}
                            target={this.state.target}
                            targetError={this.state.targetError}
                            validForm={this.state.validForm}
                            handleChangeDirect={this.handleChangeDirect}
                            handleChange={this.handleChange}
                            setTargetType={this.setTargetType}
                            removeTarget={this.removeTarget}
                            addTarget={this.addTarget}
                            disabledTypes={["IBAN", "TRANSFER"]}
                        />

                        {accessLevelForm}

                        <Grid container spacing={8}>
                            {this.state.accessLevel !== "draft" ? (
                                <Grid item xs={12}>
                                    <TypographyTranslate variant="subtitle1" style={{ marginBottom: 8 }}>
                                        Settings
                                    </TypographyTranslate>
                                </Grid>
                            ) : null}

                            {this.state.accessLevel === "full" ? (
                                <BudgetFields
                                    t={t}
                                    handleChangeFormatted={this.handleChangeFormatted}
                                    handleChangeDirect={this.handleChangeDirect}
                                    handleChange={this.handleChange}
                                    budgetFrequency={this.state.budgetFrequency}
                                    budgetError={this.state.budgetError}
                                    setBudget={this.state.setBudget}
                                    budget={this.state.budget}
                                />
                            ) : null}

                            {this.state.accessLevel === "full" || this.state.accessLevel === "showOnly" ? (
                                <TimeLimitFields
                                    t={t}
                                    handleChangeDirect={this.handleChangeDirect}
                                    setTimeLimit={this.state.setTimeLimit}
                                    timeLimit={this.state.timeLimit}
                                />
                            ) : null}

                            <Grid item xs={12}>
                                <TypographyTranslate variant="subtitle1" style={{ marginBottom: 8 }}>
                                    Advanced settings
                                </TypographyTranslate>
                            </Grid>

                            <ConnectSettingItem
                                t={t}
                                type="make_payments"
                                label="Make payments"
                                accessLevel={this.state.accessLevel}
                                checked={this.state.make_payments}
                                handleChangeDirect={this.handleChangeDirect}
                                hidden={["showOnly", "draft"]}
                            />
                            <ConnectSettingItem
                                t={t}
                                type="make_draft_payments"
                                label="Make draft payments"
                                accessLevel={this.state.accessLevel}
                                checked={this.state.make_draft_payments}
                                handleChangeDirect={this.handleChangeDirect}
                                hidden={["showOnly"]}
                            />
                            <ConnectSettingItem
                                t={t}
                                type="view_balance"
                                label="View account balance"
                                checked={this.state.view_balance}
                                handleChangeDirect={this.handleChangeDirect}
                            />
                            <ConnectSettingItem
                                t={t}
                                type="view_old_events"
                                label="View old events"
                                checked={this.state.view_old_events}
                                handleChangeDirect={this.handleChangeDirect}
                            />
                            <ConnectSettingItem
                                t={t}
                                type="view_new_events"
                                label="View new events"
                                checked={this.state.view_new_events}
                                handleChangeDirect={this.handleChangeDirect}
                            />

                            <Grid item xs={12}>
                                <ButtonTranslate
                                    variant="contained"
                                    color="primary"
                                    disabled={!this.state.validForm || this.props.shareInviteBankInquiryLoading}
                                    onClick={this.sendConnectRequest}
                                    style={styles.btn}
                                >
                                    Connect your account
                                </ButtonTranslate>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {filteredInviteResponses.length > 0 || filteredInviteInquiries.length > 0 ? (
                    <Grid item xs={12} sm={12} md={5} lg={3}>
                        <Grid container spacing={8}>
                            {filteredInviteInquiries.length > 0 ? (
                                <Grid item xs={12} sm={12}>
                                    <Paper style={styles.paperList}>
                                        <List dense>
                                            <ListSubheader>Shared With:</ListSubheader>
                                            {filteredInviteInquiries.map(filteredInviteInquiry => (
                                                <ConnectListItem
                                                    t={t}
                                                    connectInfo={filteredInviteInquiry.ShareInviteBankInquiry}
                                                    BunqJSClient={this.props.BunqJSClient}
                                                />
                                            ))}
                                        </List>
                                    </Paper>
                                </Grid>
                            ) : null}

                            {filteredInviteResponses.length > 0 ? (
                                <Grid item xs={12} sm={12}>
                                    <Paper style={styles.paperList}>
                                        <List dense>
                                            <ListSubheader>Shared By:</ListSubheader>
                                            {filteredInviteResponses.map(filteredInviteResponse => (
                                                <ConnectListItem
                                                    t={t}
                                                    connectInfo={filteredInviteResponse.ShareInviteBankResponse}
                                                    BunqJSClient={this.props.BunqJSClient}
                                                />
                                            ))}
                                        </List>
                                    </Paper>
                                </Grid>
                            ) : null}
                        </Grid>
                    </Grid>
                ) : (
                    <Grid item xs={12} sm={3} md={2} />
                )}
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        limitedPermissions: state.user.limited_permissions,

        shareInviteBankResponses: state.share_invite_bank_responses.share_invite_bank_responses,
        shareInviteBankResponsesLoading: state.share_invite_bank_responses.loading,

        shareInviteBankInquiries: state.share_invite_bank_inquiries.share_invite_bank_inquiries,
        shareInviteBankInquiriesLoading: state.share_invite_bank_inquiries.loading,

        accounts: state.accounts.accounts,
        accountsLoading: state.accounts.loading,
        selectedAccountId: state.accounts.selected_account,

        shareInviteBankInquiryLoading: state.share_invite_bank_inquiry.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        openSnackbar: message => dispatch(openSnackbar(message)),

        accountsUpdate: userId => dispatch(accountsUpdate(BunqJSClient, userId)),

        shareInviteBankInquiriesInfoUpdate: (userId, accountId) =>
            dispatch(shareInviteBankInquiriesInfoUpdate(BunqJSClient, userId, accountId)),
        shareInviteBankResponsesInfoUpdate: (userId, accountId) =>
            dispatch(shareInviteBankResponsesInfoUpdate(BunqJSClient, userId)),

        shareInviteBankInquirySend: (userId, accountId, counterparty, shareDetail, shareOptions, shareStatus) =>
            dispatch(
                shareInviteBankInquirySend(
                    BunqJSClient,
                    userId,
                    accountId,
                    counterparty,
                    shareDetail,
                    shareOptions,
                    shareStatus
                )
            )
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(Connect));
