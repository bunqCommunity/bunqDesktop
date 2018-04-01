import React from "react";
import iban from "iban";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import EmailValidator from "email-validator";

import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import { InputLabel } from "material-ui/Input";
import List, { ListItem, ListItemText } from "material-ui/List";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import { FormControl, FormControlLabel } from "material-ui/Form";
import Switch from "material-ui/Switch";
import Divider from "material-ui/Divider";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from "material-ui/Dialog";

import AccountSelectorDialog from "../../Components/FormFields/AccountSelectorDialog";
import MoneyFormatInput from "../../Components/FormFields/MoneyFormatInput";
import TargetSelection from "../../Components/FormFields/TargetSelection";

import { openSnackbar } from "../../Actions/snackbar";
import { paySend } from "../../Actions/pay";

const styles = {
    payButton: {
        width: "100%",
        marginTop: 10
    },
    formControlAlt: {
        marginBottom: 10
    },
    paper: {
        padding: 24,
        textAlign: "left"
    }
};

class Pay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            confirmModalOpen: false,

            // if true, a draft-payment will be sent instead of a default payment
            sendDraftPayment: false,

            // when false, don't allow payment request
            validForm: false,

            // source wallet has insuffient funds
            insufficientFundsCondition: false,

            // top account selection picker
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
            targetType: "EMAIL"
        };
    }

    componentDidMount() {
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
                amount:
                    valueObject.formattedValue.length > 0
                        ? valueObject.floatValue
                        : ""
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
        const duplicateTarget = this.props.t(
            "This target seems to be added already"
        );
        this.validateTargetInput(valid => {
            // target is valid, add it to the list
            if (valid) {
                const currentTargets = [...this.state.targets];

                let foundDuplicate = false;
                const targetValue =
                    this.state.targetType === "TRANSFER"
                        ? this.state.selectedTargetAccount
                        : this.state.target.trim();

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
        const {
            target,
            ibanName,
            selectedAccount,
            selectedTargetAccount,
            targetType
        } = this.state;

        const ibanNameErrorCondition =
            ibanName.length < 1 || ibanName.length > 64;

        // check if the target is valid based onthe targetType
        let targetErrorCondition = false;
        switch (targetType) {
            case "EMAIL":
                targetErrorCondition = !EmailValidator.validate(target);
                break;
            case "PHONE":
                targetErrorCondition = target.length < 5 || target.length > 64;
                break;
            case "TRANSFER":
                targetErrorCondition =
                    selectedAccount === selectedTargetAccount;
                break;
            default:
            case "IBAN":
                const filteredTarget = target.replace(/ /g, "");
                targetErrorCondition =
                    iban.isValid(filteredTarget) === false ||
                    ibanNameErrorCondition === true;
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
            targets
        } = this.state;

        const account = this.props.accounts[selectedAccount];

        const noTargetsCondition = targets.length < 0;
        const insufficientFundsCondition =
            amount !== "" &&
            amount > (account.balance ? account.balance.value : 0);
        const amountErrorCondition = amount < 0.01 || amount > 10000;
        const descriptionErrorCondition = description.length > 140;
        const ibanNameErrorCondition =
            ibanName.length < 1 || ibanName.length > 64;

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
        if (
            !this.state.validForm ||
            this.props.payLoading ||
            this.state.targets.length <= 0
        ) {
            return false;
        }
        this.closeModal();

        const { accounts, user } = this.props;
        const {
            sendDraftPayment,
            selectedAccount,
            description,
            amount,
            targets
        } = this.state;

        // account the payment is made from
        const account = accounts[selectedAccount];
        // our user id
        const userId = user.id;

        const targetInfoList = [];
        targets.map(target => {
            // check if the target is valid based onthe targetType
            let targetInfo = false;
            switch (target.type) {
                case "EMAIL":
                    targetInfo = {
                        type: "EMAIL",
                        value: target.value.trim()
                    };
                    break;
                case "PHONE":
                    targetInfo = {
                        type: "PHONE_NUMBER",
                        value: target.value.trim()
                    };
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

        this.props.paySend(
            userId,
            account.id,
            description,
            amountInfo,
            targetInfoList,
            sendDraftPayment
        );
    };

    render() {
        const t = this.props.t;
        const {
            selectedTargetAccount,
            selectedAccount,
            description,
            amount,
            targets
        } = this.state;

        let confirmationModal = null;
        if (this.state.confirmModalOpen) {
            const account = this.props.accounts[selectedAccount];

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
                    case "IBAN":
                        primaryText = `${t("IBAN")}: ${targetItem.value.replace(
                            / /g,
                            ""
                        )}`;
                        secondaryText = `${t("Name")}: ${targetItem.name}`;
                        break;
                    case "TRANSFER":
                        const account = this.props.accounts[
                            selectedTargetAccount
                        ];
                        primaryText = `${t(
                            "Transfer"
                        )}: ${account.description}`;
                        break;
                }

                return [
                    <ListItem>
                        <ListItemText
                            primary={primaryText}
                            secondary={secondaryText}
                        />
                    </ListItem>,
                    <Divider />
                ];
            });

            confirmationModal = (
                <Dialog
                    open={this.state.confirmModalOpen}
                    keepMounted
                    onClose={this.closeModal}
                >
                    <DialogTitle>{t("Confirm the payment")}</DialogTitle>
                    <DialogContent>
                        <List>
                            <ListItem>
                                <ListItemText
                                    primary={t("From")}
                                    secondary={`${account.description} ${account
                                        .balance.value}`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={t("Description")}
                                    secondary={
                                        description.length <= 0 ? (
                                            "None"
                                        ) : (
                                            description
                                        )
                                    }
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary={t("Amount")}
                                    secondary={`${amount.toFixed(2)} ${account
                                        .balance.currency}`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Targets: " />
                            </ListItem>
                            <Divider />
                            {confirmationModelTargets}
                        </List>
                    </DialogContent>
                    <DialogActions>
                        <Button
                            variant="raised"
                            onClick={this.closeModal}
                            color="secondary"
                        >
                            {t("Cancel")}
                        </Button>
                        <Button
                            variant="raised"
                            onClick={this.sendPayment}
                            color="primary"
                        >
                            {t("Confirm")}
                        </Button>
                    </DialogActions>
                </Dialog>
            );
        }

        return (
            <Grid container spacing={24} align={"center"} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Pay`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Paper style={styles.paper}>
                        <Typography variant="headline">
                            {t("New Payment")}
                        </Typography>

                        <AccountSelectorDialog
                            value={this.state.selectedAccount}
                            onChange={this.handleChangeDirect(
                                "selectedAccount"
                            )}
                            accounts={this.props.accounts}
                            BunqJSClient={this.props.BunqJSClient}
                        />
                        {this.state.insufficientFundsCondition !== false ? (
                            <InputLabel error={true}>
                                {t(
                                    "Your source account does not have sufficient funds!"
                                )}
                            </InputLabel>
                        ) : null}

                        <TargetSelection
                            selectedTargetAccount={
                                this.state.selectedTargetAccount
                            }
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

                        <FormControlLabel
                            control={
                                <Switch
                                    color="primary"
                                    checked={this.state.sendDraftPayment}
                                    onChange={() =>
                                        this.setState({
                                            sendDraftPayment: !this.state
                                                .sendDraftPayment
                                        })}
                                />
                            }
                            label={t(
                                "Draft a new payment instead of directly sending it?"
                            )}
                        />

                        <FormControl
                            style={styles.formControlAlt}
                            error={this.state.amountError}
                            fullWidth
                        >
                            <MoneyFormatInput
                                id="amount"
                                value={this.state.amount}
                                onValueChange={this.handleChangeFormatted}
                                onKeyPress={ev => {
                                    if (
                                        ev.key === "Enter" &&
                                        this.state.validForm
                                    ) {
                                        this.openModal();
                                        ev.preventDefault();
                                    }
                                }}
                            />
                        </FormControl>

                        <Button
                            variant="raised"
                            color="primary"
                            disabled={
                                !this.state.validForm || this.props.payLoading
                            }
                            style={styles.payButton}
                            onClick={this.openModal}
                        >
                            {t("Pay")}
                        </Button>
                    </Paper>

                    {confirmationModal}
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        payLoading: state.pay.loading,
        accounts: state.accounts.accounts,
        selectedAccount: state.accounts.selectedAccount,
        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        paySend: (
            userId,
            accountId,
            description,
            amount,
            targets,
            draft = false
        ) =>
            dispatch(
                paySend(
                    BunqJSClient,
                    userId,
                    accountId,
                    description,
                    amount,
                    targets,
                    draft
                )
            ),
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Pay)
);
