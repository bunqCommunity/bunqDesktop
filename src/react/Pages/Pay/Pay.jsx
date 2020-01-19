import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import iban from "iban";
import format from "date-fns/format";
import EmailValidator from "email-validator";
import enLocale from "date-fns/locale/en-US";
import deLocale from "date-fns/locale/de";
import nlLocale from "date-fns/locale/nl";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Tooltip from "@material-ui/core/Tooltip";

import EventIcon from "@material-ui/icons/Event";
import ListIcon from "@material-ui/icons/List";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";

import ConfirmationDialog from "./ConfirmationDialog";
import AccountSelectorDialog from "../../Components/FormFields/AccountSelectorDialog";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import TargetSelection from "../../Components/FormFields/TargetSelection";
import SchedulePaymentForm from "../../Components/FormFields/SchedulePaymentForm";
import TranslateButton from "../../Components/TranslationHelpers/Button";
import NavLink from "../../Components/Routing/NavLink";

import { openSnackbar } from "../../Actions/snackbar";
import { paySchedule, paySend } from "../../Actions/pay";
import { paymentInfoUpdate } from "../../Actions/payments";
import { pendingPaymentsAddPayment } from "../../Actions/pending_payments";

import { getInternationalFormat, isValidPhonenumber } from "../../Functions/PhoneLib";
import { formatMoney, getUTCDate } from "../../Functions/Utils";
import { filterShareInviteMonetaryAccountResponses } from "../../Functions/DataFilters";
import scheduleTexts from "../../Functions/ScheduleTexts";
import { connectGetBudget, connectGetType, connectGetPermissions } from "../../Functions/ConnectGetPermissions";

const styles = {
    payButton: {
        width: "100%",
        marginTop: 10
    },
    formControl: {
        width: "100%"
    },
    formControlAlt: {
        marginBottom: 10
    },
    paper: {
        padding: 24,
        textAlign: "left"
    },
    textField: {
        width: "100%"
    },
    button: {
        width: "100%"
    },
    buttonIcons: {
        marginRight: 8
    }
};

class Pay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            confirmModalOpen: false,
            // if true, a draft-payment will be sent instead of a default payment
            sendDraftPayment: false,
            // if true payment will get added to the pending payments list
            addToPendingPayments: false,
            // if true the schedule payment form is shown
            schedulePayment: false,
            scheduleStartDate: getUTCDate(new Date()),
            scheduleEndDate: null,
            recurrenceSize: 1,
            recurrenceUnit: "ONCE",
            // when false, don't allow payment request
            validForm: false,
            // source wallet has insuffient funds
            insufficientFundsCondition: false,
            // the "from" account selection picker
            selectedAccount: 0,
            // amount input field
            amountError: false,
            amount: "",
            // description input field
            descriptionError: false,
            description: "",
            // target field input field
            targetError: false,
            target: "",
            // a list of all the targets
            targets: [],
            // name field for IBAN targets
            ibanNameError: false,
            ibanName: "",
            // targeted account for transfers
            selectedTargetAccount: 1,
            selectedTargetAccountError: false,
            // defines which type is used
            targetType: "CONTACT"
        };
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(this.props.location.search);
        if (searchParams.has("amount")) {
            const amount = parseFloat(searchParams.get("amount"));
            this.setState({ amount: amount >= 0 ? amount : amount * -1 });
        }
        if (searchParams.has("iban") && searchParams.has("iban-name")) {
            const ibanParam = searchParams.get("iban");
            const ibanNameParam = searchParams.get("iban-name");
            this.setState({
                target: ibanParam,
                ibanName: ibanNameParam,
                targetType: "IBAN"
            });
        }

        // set the current account selected on the dashboard as the active one
        this.props.accounts.map((account, accountKey) => {
            if (this.props.selectedAccount === account.id) {
                this.setState({ selectedAccount: accountKey });
            }
        });

        this.checkDraftOnly();
    }

    closeModal = () => {
        this.setState({ confirmModalOpen: false });
    };
    openModal = () => {
        this.setState({ confirmModalOpen: true });
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
                    insufficientFundsCondition: false,
                    descriptionError: false,
                    ibanNameError: false,
                    targetError: false,
                    validForm: false
                });
            }
        );
    };
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
    handleChangeFormatted = valueObject => {
        this.setState(
            {
                amount: valueObject.formattedValue.length > 0 ? valueObject.floatValue : ""
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

    checkDraftOnly = () => {
        const { t, accounts, shareInviteMonetaryAccountResponses } = this.props;
        const { selectedAccount, sendDraftPayment, addToPendingPayments } = this.state;
        const outgoingPaymentsConnectMessage = t(
            "It is not possible to send outgoing payments using a draft-only account"
        );
        const outgoingPaymentsMessage = t(
            "It is not possible to send outgoing payments without draft mode when using a OAuth API key"
        );

        // ignore if addToPendingPayments is set
        if (addToPendingPayments) {
            return;
        }

        // check if on oauth session
        if (this.props.limitedPermissions) {
            // check if outgoing payments are done
            const hasOutGoing = this.state.targets.some(target => {
                return target.type !== "TRANSFER";
            });

            if (hasOutGoing) {
                // draft payment is enforced when doing outgoing payments on a oauth session
                if (!sendDraftPayment) {
                    this.setState({
                        sendDraftPayment: true
                    });

                    // notify the user
                    this.props.openSnackbar(outgoingPaymentsMessage);
                    return;
                }
            }
        }

        // get current account
        const account = accounts[selectedAccount];

        // no results means no checks required
        const connectType = connectGetType(shareInviteMonetaryAccountResponses, account.id);
        if (connectType === "ShareDetailDraftPayment" && !sendDraftPayment) {
            this.setState({
                sendDraftPayment: true
            });

            // notify the user
            this.props.openSnackbar(outgoingPaymentsConnectMessage);
        }
    };

    schedulePaymentChange = () => {
        const schedulePayment = !this.state.schedulePayment;

        this.setState(
            {
                addToPendingPayments: false,
                schedulePayment: schedulePayment,
                sendDraftPayment: false
            },
            this.validateForm
        );
    };
    draftChange = () => {
        const sendDraftPayment = this.state.sendDraftPayment;

        // check if a draft only account is selected and force
        this.checkDraftOnly();

        this.setState(
            {
                addToPendingPayments: false,
                sendDraftPayment: !sendDraftPayment,
                schedulePayment: false
            },
            this.validateForm
        );
    };

    pendingPaymentChange = () => {
        const addToPendingPayments = this.state.addToPendingPayments;

        this.setState(
            {
                addToPendingPayments: !addToPendingPayments,
                sendDraftPayment: false,
                schedulePayment: false
            },
            this.validateForm
        );
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

    // add a target from the current text inputs to the target list
    addTarget = () => {
        const duplicateTarget = this.props.t("This target seems to be added already");
        this.validateTargetInput(valid => {
            // target is valid, add it to the list
            if (valid) {
                const currentTargets = [...this.state.targets];

                let foundDuplicate = false;
                let targetValue =
                    this.state.targetType === "TRANSFER" ? this.state.selectedTargetAccount : this.state.target.trim();

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
                    if (this.props.limitedPermissions && this.state.targetType !== "TRANSFER") {
                        // limited permissions and new target isn't a transfer
                        this.setState({
                            sendDraftPayment: true
                        });
                    }

                    currentTargets.push({
                        type: this.state.targetType,
                        value: targetValue,
                        name: this.state.ibanName
                    });
                } else {
                    this.props.openSnackbar(duplicateTarget);
                }

                this.setState(
                    {
                        // set the new target list
                        targets: currentTargets,
                        // reset the inputs
                        target: "",
                        ibanName: ""
                    },
                    () => {
                        this.validateForm();
                        this.validateTargetInput();
                    }
                );
            }
        });
    };

    // validate only the taret inputs
    validateTargetInput = (callback = () => {}) => {
        const { target, ibanName, selectedAccount, selectedTargetAccount, targetType } = this.state;

        const ibanNameErrorCondition = ibanName.length < 1 || ibanName.length > 64;

        // check if the target is valid based onthe targetType
        let targetErrorCondition = false;
        switch (targetType) {
            case "CONTACT":
                const validEmail = EmailValidator.validate(target);
                const validPhone = isValidPhonenumber(target);

                // only error if both are false
                targetErrorCondition = !validEmail && !validPhone;
                break;
            case "TRANSFER":
                targetErrorCondition = selectedAccount === selectedTargetAccount;
                break;
            default:
            case "IBAN":
                const filteredTarget = target.replace(/ /g, "");
                targetErrorCondition = iban.isValid(filteredTarget) === false || ibanNameErrorCondition === true;
                break;
        }

        this.setState(
            {
                targetError: targetErrorCondition,
                ibanNameError: ibanNameErrorCondition
            },
            () => callback(!targetErrorCondition)
        );
    };

    // validates all the possible input combinations
    validateForm = () => {
        const {
            description,
            amount,
            ibanName,
            selectedAccount,
            sendDraftPayment,
            schedulePayment,
            targets
        } = this.state;

        const account = this.props.accounts[selectedAccount];

        // check if this account item has connect details
        const filteredInviteResponses = this.props.shareInviteMonetaryAccountResponses.filter(
            filterShareInviteMonetaryAccountResponses(account.id)
        );

        // regular balance value
        let accountBalance = account.balance ? account.balance.value : 0;

        // get budget if atleast one connect
        if (filteredInviteResponses.length > 0) {
            const connectBudget = connectGetBudget(filteredInviteResponses);
            if (connectBudget) {
                accountBalance = connectBudget;
            }
        }

        // check if a draft only account is selected and force
        this.checkDraftOnly();

        const noTargetsCondition = targets.length < 0;
        const insufficientFundsCondition =
            amount !== "" &&
            // enough funds or draft enabled
            amount > accountBalance &&
            sendDraftPayment === false &&
            schedulePayment === false;
        const amountErrorCondition = amount < 0.01 || amount > 100000;
        const descriptionErrorCondition = description.length > 140;
        const ibanNameErrorCondition = ibanName.length < 1 || ibanName.length > 64;

        this.setState({
            amountError: amountErrorCondition,
            insufficientFundsCondition: insufficientFundsCondition,
            descriptionError: descriptionErrorCondition,
            ibanNameError: ibanNameErrorCondition,
            validForm:
                !noTargetsCondition &&
                !insufficientFundsCondition &&
                !amountErrorCondition &&
                !descriptionErrorCondition &&
                targets.length > 0
        });
    };

    // send the actual payment
    sendPayment = () => {
        if (!this.state.validForm || this.props.payLoading || this.state.targets.length <= 0) {
            return false;
        }
        this.closeModal();

        const { accounts, user } = this.props;
        const {
            sendDraftPayment,
            selectedAccount,
            description,
            amount,
            targets,
            addToPendingPayments,
            schedulePayment,
            scheduleStartDate,
            scheduleEndDate,
            recurrenceSize,
            recurrenceUnit
        } = this.state;

        // account the payment is made from
        const account = accounts[selectedAccount];
        // our user id
        const userId = user.id;

        const targetInfoList = [];
        targets.forEach(target => {
            // check if the target is valid based onthe targetType
            let targetInfo = false;
            switch (target.type) {
                case "CONTACT":
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
                    break;
                case "TRANSFER":
                    const otherAccount = accounts[target.value];

                    otherAccount.alias.map(alias => {
                        if (alias.type === "IBAN") {
                            targetInfo = {
                                type: "IBAN",
                                value: alias.value.trim(),
                                name: alias.name
                            };
                        }
                    });
                    break;
                case "IBAN":
                    const filteredTarget = target.value.replace(/ /g, "");
                    targetInfo = {
                        type: "IBAN",
                        value: filteredTarget,
                        name: target.name
                    };
                    break;
                default:
                    // invalid type
                    break;
            }

            if (targetInfo !== false) targetInfoList.push(targetInfo);
        });

        const amountInfo = {
            value: amount + "", // sigh, number has to be sent as a string
            currency: "EUR"
        };

        if (schedulePayment) {
            const schedule = {
                time_start: format(getUTCDate(scheduleStartDate), "yyyy-MM-dd HH:mm:ss"),
                recurrence_unit: recurrenceUnit,
                // on once size has to be 1
                recurrence_size: parseInt(recurrenceUnit !== "ONCE" ? recurrenceSize : 1)
            };

            if (scheduleEndDate) {
                schedule.time_end = format(getUTCDate(scheduleEndDate), "yyyy-MM-dd HH:mm:ss");
            }

            this.props.paySchedule(userId, account.id, description, amountInfo, targetInfoList, schedule);
        } else if (addToPendingPayments) {
            this.props.pendingPaymentsAddPayment(account.id, {
                description: description,
                amount: amountInfo,
                counterparty_aliases: targetInfoList
            });
            this.props.openSnackbar(this.props.t("The payment was added to the pending payments listed"));
        } else {
            // regular payment/draft
            this.props.paySend(userId, account.id, description, amountInfo, targetInfoList, sendDraftPayment);
        }

        setTimeout(() => {
            const connectPermissions = connectGetPermissions(
                this.props.shareInviteMonetaryAccountResponses,
                account.id
            );
            if (connectPermissions && connectPermissions.view_new_events) {
                this.props.paymentInfoUpdate(userId, account.id);
            }
        }, 1000);

        this.setState({
            validForm: false,
            amountError: false,
            amount: "",
            descriptionError: false,
            description: "",
            targetError: false,
            target: "",
            targets: [],
            ibanNameError: false,
            ibanName: ""
        });
    };

    render() {
        const { t, limitedPermissions } = this.props;
        const {
            selectedTargetAccount,
            selectedAccount,
            description,
            amount,
            targets,
            scheduleEndDate,
            scheduleStartDate
        } = this.state;
        const account = this.props.accounts[selectedAccount];

        let accountBalance = 0;
        if (account) {
            // check if this account item has connect details
            const filteredInviteResponses = this.props.shareInviteMonetaryAccountResponses.filter(
                filterShareInviteMonetaryAccountResponses(account.id)
            );

            // regular balance value
            accountBalance = account.balance ? account.balance.value : 0;
            if (filteredInviteResponses.length > 0) {
                const connectBudget = connectGetBudget(filteredInviteResponses);
                if (connectBudget) {
                    accountBalance = connectBudget;
                }
            }
        }
        accountBalance = formatMoney(accountBalance, true);

        let scheduledPaymentText = null;
        if (this.state.schedulePayment) {
            const scheduleTextResult = scheduleTexts(
                t,
                this.state.scheduleStartDate,
                this.state.scheduleEndDate,
                this.state.recurrenceSize,
                this.state.recurrenceUnit
            );

            scheduledPaymentText = (
                <ListItem>
                    <ListItemText primary={scheduleTextResult.primary} secondary={scheduleTextResult.secondary} />
                </ListItem>
            );
        }

        let localeData;
        switch (this.props.language) {
            case "nl":
                localeData = nlLocale;
                break;
            case "de":
                localeData = deLocale;
                break;
            case "en":
            default:
                localeData = enLocale;
                break;
        }

        let payButtonText = "Pay";
        if (this.state.addToPendingPayments) {
            payButtonText = "Add to pending payments";
        } else if (this.state.sendDraftPayment) {
            payButtonText = "Draft payment";
        } else if (this.state.schedulePayment) {
            payButtonText = "Schedule Payment";
        }

        return (
            <Grid container spacing={8} justify="center" align="center">
                <Helmet>
                    <title>{`bunqDesktop - Pay`}</title>
                </Helmet>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeData}>
                    <Grid item xs={12} sm={12} md={2} lg={3}>
                        <Button onClick={this.props.history.goBack}>
                            <ArrowBackIcon />
                        </Button>
                    </Grid>

                    <Grid item xs={12} sm={10} md={8} lg={6}>
                        <Grid container spacing={8}>
                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    component={NavLink}
                                    to="/scheduled-payments"
                                    style={styles.button}
                                >
                                    <EventIcon style={styles.buttonIcons} />
                                    {t("Scheduled payments")}
                                </Button>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    component={NavLink}
                                    to="/pending-payments"
                                    style={styles.button}
                                >
                                    <ListIcon style={styles.buttonIcons} />
                                    {t("Pending payments")}: {Object.keys(this.props.pendingPayments).length}
                                </Button>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper style={styles.paper}>
                                    <Typography variant="h5">{t("New Payment")}</Typography>

                                    <AccountSelectorDialog
                                        value={this.state.selectedAccount}
                                        onChange={this.handleChangeDirect("selectedAccount")}
                                        accounts={this.props.accounts}
                                        BunqJSClient={this.props.BunqJSClient}
                                        hiddenConnectTypes={["showOnly"]}
                                    />
                                    {this.state.insufficientFundsCondition !== false ? (
                                        <InputLabel error={true}>
                                            {t("Your source account does not have sufficient funds!")}
                                        </InputLabel>
                                    ) : null}

                                    <TargetSelection
                                        selectedTargetAccount={selectedTargetAccount}
                                        targetType={this.state.targetType}
                                        targets={this.state.targets}
                                        target={this.state.target}
                                        ibanNameError={this.state.ibanNameError}
                                        ibanName={this.state.ibanName}
                                        targetError={this.state.targetError}
                                        validForm={this.state.validForm}
                                        accounts={this.props.accounts}
                                        handleChangeDirect={this.handleChangeDirect}
                                        handleChange={this.handleChange}
                                        setTargetType={this.setTargetType}
                                        removeTarget={this.removeTarget}
                                        addTarget={this.addTarget}
                                    />

                                    <TextField
                                        fullWidth
                                        error={this.state.descriptionError}
                                        id="description"
                                        label={t("Description")}
                                        value={this.state.description}
                                        onChange={this.handleChange("description")}
                                        margin="normal"
                                    />

                                    <Grid container>
                                        <Grid item xs={12} sm={4}>
                                            <Tooltip
                                                title={t(
                                                    "Draft payments are NOT completed right away allowing you to review and confirm them in the official bunq app"
                                                )}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            color="primary"
                                                            checked={this.state.sendDraftPayment}
                                                            onChange={this.draftChange}
                                                        />
                                                    }
                                                    label={t("Draft this payment")}
                                                />
                                            </Tooltip>
                                        </Grid>
                                        <Grid item xs={12} sm={4}>
                                            <Tooltip
                                                title={t(
                                                    "Store this payment in the pending payments list for later, it will NOT be sent to bunq"
                                                )}
                                            >
                                                <FormControlLabel
                                                    control={
                                                        <Switch
                                                            color="primary"
                                                            checked={this.state.addToPendingPayments}
                                                            onChange={this.pendingPaymentChange}
                                                        />
                                                    }
                                                    label={t("Save payment for later")}
                                                />
                                            </Tooltip>
                                        </Grid>

                                        <Grid item xs={12} sm={4}>
                                            <FormControlLabel
                                                control={
                                                    <Switch
                                                        color="primary"
                                                        disabled={limitedPermissions}
                                                        checked={this.state.schedulePayment}
                                                        onChange={this.schedulePaymentChange}
                                                    />
                                                }
                                                label={t("Schedule payment")}
                                            />
                                        </Grid>

                                        <SchedulePaymentForm
                                            t={t}
                                            schedulePayment={this.state.schedulePayment}
                                            recurrenceUnit={this.state.recurrenceUnit}
                                            recurrenceSize={this.state.recurrenceSize}
                                            scheduleEndDate={scheduleEndDate}
                                            scheduleStartDate={scheduleStartDate}
                                            handleChangeDirect={this.handleChangeDirect}
                                            handleChange={this.handleChange}
                                        />
                                    </Grid>

                                    <FormControl style={styles.formControlAlt} error={this.state.amountError} fullWidth>
                                        <MoneyFormatInput
                                            id="amount"
                                            value={this.state.amount}
                                            onValueChange={this.handleChangeFormatted}
                                            onKeyPress={ev => {
                                                if (ev.key === "Enter" && this.state.validForm) {
                                                    this.openModal();
                                                    ev.preventDefault();
                                                }
                                            }}
                                        />
                                    </FormControl>

                                    <TranslateButton
                                        variant="contained"
                                        color="primary"
                                        disabled={!this.state.validForm || this.props.payLoading}
                                        style={styles.payButton}
                                        onClick={this.openModal}
                                    >
                                        {payButtonText}
                                    </TranslateButton>
                                </Paper>
                            </Grid>
                        </Grid>
                        <ConfirmationDialog
                            closeModal={this.closeModal}
                            sendPayment={this.sendPayment}
                            amount={amount}
                            account={account}
                            targets={targets}
                            description={description}
                            accountBalance={accountBalance}
                            scheduledPaymentText={scheduledPaymentText}
                            confirmModalOpen={this.state.confirmModalOpen}
                        />
                    </Grid>

                    <Grid item md={2} lg={3} />
                </MuiPickersUtilsProvider>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        payLoading: state.pay.loading,

        accounts: state.accounts.accounts,
        selectedAccount: state.accounts.selected_account,

        language: state.options.language,

        pendingPayments: state.pending_payments.pending_payments,

        shareInviteMonetaryAccountResponses:
            state.share_invite_monetary_account_responses.share_invite_monetary_account_responses,

        user: state.user.user,
        limitedPermissions: state.user.limited_permissions
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        paySend: (userId, accountId, description, amount, targets, draft = false) =>
            dispatch(paySend(BunqJSClient, userId, accountId, description, amount, targets, draft)),
        paySchedule: (userId, accountId, description, amount, targets, schedule) =>
            dispatch(paySchedule(BunqJSClient, userId, accountId, description, amount, targets, schedule)),
        openSnackbar: message => dispatch(openSnackbar(message)),

        paymentInfoUpdate: (userId, accountId) => dispatch(paymentInfoUpdate(BunqJSClient, userId, accountId)),

        pendingPaymentsAddPayment: (accountId, pendingPayment) =>
            dispatch(pendingPaymentsAddPayment(BunqJSClient, accountId, pendingPayment))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(translate("translations")(Pay));
