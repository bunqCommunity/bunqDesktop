import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Redirect from "react-router-dom/Redirect";
import EmailValidator from "email-validator";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Radio from "@material-ui/core/Radio";
import FormControl from "@material-ui/core/FormControl";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ConnectListItem from "./ConnectListItem";
import AccountListItem from "../../Components/AccountList/AccountListItem";
import TargetSelection from "../../Components/FormFields/TargetSelection";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import TypographyTranslate from "../../Components/TranslationHelpers/Typography";
import {
    filterShareInviteBankInquiries,
    filterShareInviteBankResponses
} from "../../Helpers/DataFilters";

import { shareInviteBankResponsesInfoUpdate } from "../../Actions/share_invite_bank_response";
import { shareInviteBankInquiriesInfoUpdate } from "../../Actions/share_invite_bank_inquiry";
import { accountsUpdate } from "../../Actions/accounts";
import { openSnackbar } from "../../Actions/snackbar";
import FullAccess from "../../Components/ListItems/ShareInviteBankTypes/FullAccess";
import ParentChild from "../../Components/ListItems/ShareInviteBankTypes/ParentChild";
import ShowOnly from "../../Components/ListItems/ShareInviteBankTypes/ShowOnly";
import {
    getInternationalFormat,
    isValidPhonenumber
} from "../../Helpers/PhoneLib";

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
            budget: 1000,
            budgetError: false,

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
    handleChangeDirect = name => value => {
        this.setState(
            {
                [name]: value
            },
            this.validateForm
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

    // add a target from the current text inputs to the target list
    addTarget = () => {
        const duplicateTargetMessage = this.props.t(
            "This target seems to be added already"
        );
        this.validateTargetInput(valid => {
            // target is valid, add it to the list
            if (valid) {
                const currentTargets = [...this.state.targets];

                let foundDuplicate = false;
                let targetValue = this.state.target.trim();

                if (isValidPhonenumber(targetValue)) {
                    // valid phone number, we must format as international
                    targetValue = getInternationalFormat(targetValue);
                }

                // check for duplicates in existing target list
                currentTargets.map(newTarget => {
                    if (newTarget.type === this.state.targetType) {
                        if (newTarget.value === targetValue) {
                            foundDuplicate = true;
                        }
                    }
                });

                if (!foundDuplicate) {
                    currentTargets.push({
                        type: this.state.targetType,
                        value: targetValue,
                        name: ""
                    });
                } else {
                    this.props.openSnackbar(duplicateTargetMessage);
                }

                this.setState(
                    {
                        // set the new target list
                        targets: currentTargets,
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
        this.setState(
            {
                targetType: type,
                target: ""
            },
            () => {
                this.setState({
                    amountError: false,
                    redurectUrlError: false,
                    descriptionError: false,
                    targetError: false,
                    validForm: false
                });
            }
        );
    };

    validateForm = () => {
        const { budget, target, targets, targetType } = this.state;

        const budgetErrorCondition = budget < 0.01 || budget > 10000;

        // check if the target is valid based onthe targetType
        let targetErrorCondition = false;
        switch (targetType) {
            case "CONTACT":
                const validEmail = EmailValidator.validate(target);
                const validPhone = isValidPhonenumber(target);

                // only error if both are false
                targetErrorCondition = !validEmail && !validPhone;
                break;
            default:
        }

        this.setState({
            budgetError: budgetErrorCondition,
            validForm: !budgetErrorCondition && targets.length > 0
        });
    };

    connectTest = event => {
        this.props.BunqJSClient.api.shareInviteBankInquiry
            .post(
                457,
                602,
                {
                    type: "EMAIL",
                    value: "cass.eireann-beaufort@bunq.bar"
                },
                {
                    ShareDetailReadOnly: {
                        view_balance: true,
                        view_old_events: false,
                        view_new_events: true
                    }
                    // ShareDetailPayment: {
                    //     make_payments: true,
                    //     make_draft_payments: true,
                    //     view_balance: true,
                    //     view_old_events: true,
                    //     view_new_events: true,
                    //     budget: {
                    //         amount: {
                    //             value: "25.00",
                    //             currency: "EUR"
                    //         },
                    //         frequency: "DAILY"
                    //     }
                    // },
                    // ShareDetailDraftPayment: {
                    //     make_draft_payments: true,
                    //     view_balance: true,
                    //     view_old_events: true,
                    //     view_new_events: true
                    // }
                },
                "PENDING",
                {
                    share_type: "STANDARD"
                }
            )
            .then(console.log)
            .catch(console.error);
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
                <ParentChild
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
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Connect`}</title>
                </Helmet>

                <Grid item xs={12} sm={3} lg={4}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={6} lg={4}>
                    <Paper style={styles.paper}>
                        <TypographyTranslate
                            variant="headline"
                            style={{ marginBottom: "25px" }}
                        >
                            Send a Connect request
                        </TypographyTranslate>

                        <List dense>
                            <AccountListItem
                                account={accountInfo}
                                clickable={false}
                            />
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

                        {this.state.accessLevel === "full" ? (
                            <React.Fragment>
                                <FormControlLabel
                                    control={
                                        <Switch
                                            checked={this.state.setBudget}
                                            onChange={e =>
                                                this.setState({
                                                    setBudget: !this.state
                                                        .setBudget
                                                })}
                                            value="setBudget"
                                            color="primary"
                                        />
                                    }
                                    label="Set a budget"
                                />
                                {this.state.setBudget ? (
                                    <FormControl error={this.state.budgetError}>
                                        <MoneyFormatInput
                                            id="budget"
                                            onValueChange={
                                                this.handleChangeFormatted
                                            }
                                            value={this.state.budget}
                                        />
                                    </FormControl>
                                ) : null}
                            </React.Fragment>
                        ) : null}

                        {/*<ButtonTranslate*/}
                        {/*variant="raised"*/}
                        {/*color="primary"*/}
                        {/*disabled={!this.state.validForm}*/}
                        {/*onClick={this.createAccount}*/}
                        {/*style={styles.btn}*/}
                        {/*>*/}
                        {/*Create account*/}
                        {/*</ButtonTranslate>*/}

                        <Button
                            variant="raised"
                            color="primary"
                            onClick={this.connectTest}
                        >
                            Lydia pls
                        </Button>
                    </Paper>
                </Grid>

                <Grid item xs={12} />
                <Grid item xs={12} sm={3} />

                <Grid item xs={12} sm={6}>
                    {filteredInviteResponses.length > 0 ||
                    filteredInviteInquiries.length > 0 ? (
                        <Grid container spacing={8}>
                            <Grid item xs={12} sm={6}>
                                <Paper style={styles.paperList}>
                                    <List dense>
                                        <ListSubheader>
                                            Shared With:
                                        </ListSubheader>
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
                                        <ListSubheader>
                                            Shared By:
                                        </ListSubheader>
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
