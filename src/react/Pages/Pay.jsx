import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import EmailValidator from "email-validator";
import format from "date-fns/format";
import iban from "iban";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/utils/MuiPickersUtilsProvider";
import enLocale from "date-fns/locale/en-US";
import deLocale from "date-fns/locale/de";
import nlLocale from "date-fns/locale/nl";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Paper from "@material-ui/core/Paper";
import Switch from "@material-ui/core/Switch";
import Divider from "@material-ui/core/Divider";
import TextField from "@material-ui/core/TextField";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import AccountSelectorDialog from "../Components/FormFields/AccountSelectorDialog";
import MoneyFormatInput from "../Components/FormFields/MoneyFormatInput";
import TargetSelection from "../Components/FormFields/TargetSelection";
import SchedulePaymentForm from "../Components/FormFields/SchedulePaymentForm";

import { openSnackbar } from "../Actions/snackbar";
import { paySchedule, paySend } from "../Actions/pay";

import scheduleTexts from "../Helpers/ScheduleTexts";
import { getInternationalFormat, isValidPhonenumber } from "../Helpers/PhoneLib";
import { formatMoney, getUTCDate } from "../Helpers/Utils";
import { filterShareInviteBankResponses } from "../Helpers/DataFilters";
import GetShareDetailBudget from "../Helpers/GetShareDetailBudget";

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
    }
};

class Pay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            confirmModalOpen: false,

            // if true, a draft-payment will be sent instead of a default payment
            sendDraftPayment: false,

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

    schedulePaymentChange = () => {
        const schedulePayment = !this.state.schedulePayment;

        this.setState(
            {
                schedulePayment: schedulePayment
            },
            this.validateForm
        );
        if (schedulePayment) {
            this.setState(
                {
                    sendDraftPayment: false
                },
                this.validateForm
            );
        }
    };

    checkDraftOnly = () => {
        const { t, accounts, shareInviteBankResponses } = this.props;
        const { selectedAccount, sendDraftPayment } = this.state;
        const outgoingPaymentsConnectMessage = t(
            "It is not possible to send outgoing payments using a draft-only account"
        );

        // get current account
        const account = accounts[selectedAccount];

        // check if the selected account item has connect details
        const filteredInviteResponses = shareInviteBankResponses.filter(filterShareInviteBankResponses(account.id));

        // no results means no checks required
        if (filteredInviteResponses.length > 0) {
            // get first item from the list
            const firstInviteResponse = filteredInviteResponses.pop();
            const inviteResponse = firstInviteResponse.ShareInviteBankResponse;

            // get the key values for this list
            const shareDetailKeys = Object.keys(inviteResponse.share_detail);
            if (shareDetailKeys.includes("ShareDetailDraftPayment")) {
                // draft payment is enforced when doing outgoing payments on a oauth session
                if (!sendDraftPayment) {
                    this.setState({
                        sendDraftPayment: true
                    });

                    // notify the user
                    this.props.openSnackbar(outgoingPaymentsConnectMessage);
                }
            }
        }
    };

    draftChange = () => {
        const sendDraftPayment = !this.state.sendDraftPayment;
        const outgoingPaymentsMessage = this.props.t(
            "It is not possible to send outgoing payments without draft mode when using a OAuth API key"
        );

        // check if a draft only account is selected and force
        this.checkDraftOnly();

        // check if on oauth session
        if (this.props.limitedPermissions) {
            // check if outgoing payments are done
            const hasOutGoing = this.state.targets.some(target => {
                return target.type !== "TRANSFER";
            });

            if (hasOutGoing) {
                // draft payment is enforced when doing outgoing payments on a oauth session
                if (!this.state.sendDraftPayment) {
                    this.setState({
                        sendDraftPayment: true
                    });
                }

                // notify the user
                this.props.openSnackbar(outgoingPaymentsMessage);
                return;
            }
        }

        this.setState(
            {
                sendDraftPayment: sendDraftPayment
            },
            this.validateForm
        );
        if (sendDraftPayment) {
            this.setState(
                {
                    schedulePayment: false
                },
                this.validateForm
            );
        }
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
        const { description, amount, ibanName, selectedAccount, sendDraftPayment, targets } = this.state;

        const account = this.props.accounts[selectedAccount];

        // check if this account item has connect details
        const filteredInviteResponses = this.props.shareInviteBankResponses.filter(
            filterShareInviteBankResponses(account.id)
        );

        // regular balance value
        let accountBalance = account.balance ? account.balance.value : 0;

        // get budget if atleast one connect
        if (filteredInviteResponses.length > 0) {
            const connectBudget = GetShareDetailBudget(filteredInviteResponses);
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
            (amount > accountBalance && sendDraftPayment === false);
        const amountErrorCondition = amount < 0.01 || amount > 10000;
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
                time_start: format(getUTCDate(scheduleStartDate), "YYYY-MM-dd HH:mm:ss"),
                recurrence_unit: recurrenceUnit,
                // on once size has to be 1
                recurrence_size: parseInt(recurrenceUnit !== "ONCE" ? recurrenceSize : 1)
            };

            if (scheduleEndDate) {
                schedule.time_end = format(getUTCDate(scheduleEndDate), "YYYY-MM-dd HH:mm:ss");
            }

            this.props.paySchedule(userId, account.id, description, amountInfo, targetInfoList, schedule);
        } else {
            // regular payment/draft
            this.props.paySend(userId, account.id, description, amountInfo, targetInfoList, sendDraftPayment);
        }
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
            const filteredInviteResponses = this.props.shareInviteBankResponses.filter(
                filterShareInviteBankResponses(account.id)
            );

            // regular balance value
            accountBalance = account.balance ? account.balance.value : 0;
            if (filteredInviteResponses.length > 0) {
                const connectBudget = GetShareDetailBudget(filteredInviteResponses);
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

        let confirmationModal = null;
        if (this.state.confirmModalOpen) {
            // create a list of ListItems with our targets
            const confirmationModelTargets = targets.map(targetItem => {
                let primaryText = "";
                let secondaryText = "";

                switch (targetItem.type) {
                    case "PHONE":
                        primaryText = `${t("Phone")}: ${targetItem.value}`;
                        break;
                    case "EMAIL":
                        primaryText = `${t("Email")}: ${targetItem.value}`;
                        break;
                    case "CONTACT":
                        primaryText = `${t("Contact")}: ${targetItem.value}`;
                        break;
                    case "IBAN":
                        primaryText = `${t("IBAN")}: ${targetItem.value.replace(/ /g, "")}`;
                        secondaryText = `${t("Name")}: ${targetItem.name}`;
                        break;
                    case "TRANSFER":
                        const targetAccountInfo = this.props.accounts[targetItem.value];
                        primaryText = `${t("Transfer")}: ${targetAccountInfo.description}`;
                        break;
                }

                return [
                    <ListItem>
                        <ListItemText primary={primaryText} secondary={secondaryText} />
                    </ListItem>,
                    <Divider />
                ];
            });

            confirmationModal = (
                <Dialog open={this.state.confirmModalOpen} keepMounted onClose={this.closeModal}>
                    <DialogTitle>{t("Confirm the payment")}</DialogTitle>
                    <DialogContent>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary={t("From")}
                                    secondary={`${account.description} ${accountBalance}`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={t("Description")}
                                    secondary={description.length <= 0 ? "None" : description}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary={t("Amount")} secondary={formatMoney(amount)} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Targets: " />
                            </ListItem>
                            <Divider />
                            {confirmationModelTargets}

                            {scheduledPaymentText ? scheduledPaymentText : null}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="raised" onClick={this.closeModal} color="secondary">
                            {t("Cancel")}
                        </Button>
                        <Button variant="raised" onClick={this.sendPayment} color="primary">
                            {t("Confirm")}
                        </Button>
                    </DialogActions>
                </Dialog>
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

        return (
            <Grid container spacing={24} align={"center"} justify={"center"}>
                <Helmet>
                    <title>{`bunqDesktop - Pay`}</title>
                </Helmet>
                <MuiPickersUtilsProvider utils={DateFnsUtils} locale={localeData}>
                    <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                        <Paper style={styles.paper}>
                            <Typography variant="headline">{t("New Payment")}</Typography>

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
                                <Grid item xs={6}>
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
                                </Grid>

                                {limitedPermissions ? null : (
                                    <Grid item xs={6}>
                                        <FormControlLabel
                                            control={
                                                <Switch
                                                    color="primary"
                                                    checked={this.state.schedulePayment}
                                                    onChange={this.schedulePaymentChange}
                                                />
                                            }
                                            label={t("Schedule payment")}
                                        />
                                    </Grid>
                                )}

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

                            <Button
                                variant="raised"
                                color="primary"
                                disabled={!this.state.validForm || this.props.payLoading}
                                style={styles.payButton}
                                onClick={this.openModal}
                            >
                                {t("Pay")}
                            </Button>
                        </Paper>

                        {confirmationModal}
                    </Grid>
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

        shareInviteBankResponses: state.share_invite_bank_responses.share_invite_bank_responses,

        user: state.user.user,
        limitedPermissions: state.user.limited_permissions
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        paySend: (userId, accountId, description, amount, targets, draft = false, schedule = false) =>
            dispatch(paySend(BunqJSClient, userId, accountId, description, amount, targets, draft, schedule)),
        paySchedule: (userId, accountId, description, amount, targets, schedule) =>
            dispatch(paySchedule(BunqJSClient, userId, accountId, description, amount, targets, schedule)),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(Pay));
