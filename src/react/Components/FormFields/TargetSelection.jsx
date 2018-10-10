import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { translate } from "react-i18next";
import CopyToClipboard from "react-copy-to-clipboard";
import Grid from "@material-ui/core/Grid";
import Radio from "@material-ui/core/Radio";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";

import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import CompareArrowsIcon from "@material-ui/icons/CompareArrows";
import PersonIcon from "@material-ui/icons/Person";

import InputSuggestions from "./InputSuggestions";
import AccountSelectorDialog from "./AccountSelectorDialog";
import { openSnackbar } from "../../Actions/snackbar";
import { formatIban } from "../../Helpers/Utils";

const styles = {
    payButton: {
        width: "100%"
    },
    chips: {
        margin: 5
    }
};

class TargetSelection extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            ibanList: []
        };
    }

    componentDidMount() {
        if (!this.props.disabledTypes.includes("IBAN")) {
            let ibanCollection = {};
            // get first 250 payments and retrieve the iban/name combinations from it
            this.props.payments.slice(0, 250).map(payment => {
                if (payment.counterparty_alias && payment.counterparty_alias.iban) {
                    const iban = payment.counterparty_alias.iban;
                    if (!ibanCollection[iban]) {
                        ibanCollection[iban] = {
                            field: formatIban(iban),
                            name: payment.counterparty_alias.display_name
                        };
                    }
                }
            });

            // turn ref object into an array
            const ibanList = Object.keys(ibanCollection).map(key => ibanCollection[key]);

            // sort by name
            const sortedIbanList = ibanList.sort((a, b) => {
                if (a.name < b.name) return -1;
                if (a.name > b.name) return 1;
                return 0;
            });

            this.setState({
                ibanList: sortedIbanList
            });
        }
    }

    enterKeySubmit = ev => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            this.props.addTarget();
        }
    };

    copiedValue = event => {
        this.props.openSnackbar(this.props.t(`Copied to your clipboard`));
    };

    render() {
        const t = this.props.t;
        let targetContent = null;
        switch (this.props.targetType) {
            case "TRANSFER":
                targetContent = (
                    <AccountSelectorDialog
                        id="target"
                        value={this.props.selectedTargetAccount}
                        onChange={this.props.handleChangeDirect("selectedTargetAccount")}
                        accounts={this.props.accounts}
                        BunqJSClient={this.props.BunqJSClient}
                    />
                );
                break;
            case "PHONE":
            case "EMAIL":
            case "CONTACT":
                // loop through all types and create a full list of contacts (name/email combination)
                let contactList = [];
                Object.keys(this.props.contacts).map(contactType => {
                    // go through all contacts for this type
                    this.props.contacts[contactType].forEach(contact => {
                        // go through all emails for this contact
                        contact.emails.forEach(email => {
                            contactList.push({
                                field: email,
                                name: contact.name
                            });
                        });

                        // go through all phoneNumbers for this contact
                        contact.phoneNumbers.forEach(phoneNumber => {
                            contactList.push({
                                field: phoneNumber,
                                name: contact.name
                            });
                        });
                    });
                });

                targetContent = (
                    <InputSuggestions
                        autoFocus
                        fullWidth
                        id="target"
                        items={contactList}
                        label={t("Email or phone number")}
                        error={this.props.targetError}
                        value={this.props.target}
                        onChange={this.props.handleChange("target")}
                        onSelectItem={this.props.handleChangeDirect("target")}
                        onKeyPress={this.enterKeySubmit}
                    />
                );
                break;
            default:
            case "IBAN":
                targetContent = [
                    <InputSuggestions
                        autoFocus
                        fullWidth
                        id="target"
                        items={this.state.ibanList}
                        label={t("IBAN number")}
                        error={this.props.targetError}
                        value={this.props.target}
                        onChange={this.props.handleChange("target")}
                        onChangeName={this.props.handleChangeDirect("ibanName")}
                        onSelectItem={this.props.handleChangeDirect("target")}
                        onKeyPress={this.enterKeySubmit}
                    />,
                    <TextField
                        fullWidth
                        required
                        error={this.props.ibanNameError}
                        id="ibanName"
                        label={t("IBAN name")}
                        value={this.props.ibanName}
                        onChange={this.props.handleChange("ibanName")}
                        margin="normal"
                        onKeyPress={this.enterKeySubmit}
                    />
                ];
                break;
        }

        const chipList = this.props.targets.map((target, targetKey) => {
            let Icon = null;
            let targetValue = target.value;
            switch (target.type) {
                case "EMAIL":
                case "PHONE":
                case "CONTACT":
                    Icon = PersonIcon;
                    break;
                case "TRANSFER":
                    // for transfers we can try to display a description
                    if (this.props.accounts[target.value]) {
                        targetValue = this.props.accounts[target.value].description;
                    }
                    Icon = CompareArrowsIcon;
                    break;
                default:
                case "IBAN":
                    Icon = AccountBalanceIcon;
                    break;
            }

            return (
                <Chip
                    style={styles.chips}
                    avatar={
                        <Avatar>
                            <Icon color="primary" />
                        </Avatar>
                    }
                    label={
                        <CopyToClipboard text={targetValue} onCopy={this.copiedValue}>
                            <p>{targetValue}</p>
                        </CopyToClipboard>
                    }
                    onDelete={event => this.props.removeTarget(targetKey)}
                />
            );
        });

        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    {chipList}
                </Grid>
                {this.props.disabledTypes.includes("CONTACT") ? null : (
                    <Grid item xs={6} sm={4}>
                        <FormControlLabel
                            control={
                                <Radio
                                    icon={<PersonIcon />}
                                    checkedIcon={<PersonIcon />}
                                    color="secondary"
                                    checked={this.props.targetType === "CONTACT"}
                                    onChange={this.props.setTargetType("CONTACT")}
                                    value="CONTACT"
                                    name="target-type-phone"
                                />
                            }
                            label={"CONTACT"}
                        />
                    </Grid>
                )}
                {this.props.disabledTypes.includes("IBAN") ? null : (
                    <Grid item xs={6} sm={4}>
                        <FormControlLabel
                            control={
                                <Radio
                                    icon={<AccountBalanceIcon />}
                                    checkedIcon={<AccountBalanceIcon />}
                                    checked={this.props.targetType === "IBAN"}
                                    onChange={this.props.setTargetType("IBAN")}
                                    value="IBAN"
                                    name="target-type-iban"
                                />
                            }
                            label="IBAN"
                        />
                    </Grid>
                )}
                {this.props.disabledTypes.includes("TRANSFER") ? null : (
                    <Grid item xs={6} sm={4}>
                        <FormControlLabel
                            control={
                                <Radio
                                    icon={<CompareArrowsIcon />}
                                    checkedIcon={<CompareArrowsIcon />}
                                    color="secondary"
                                    checked={this.props.targetType === "TRANSFER"}
                                    onChange={this.props.setTargetType("TRANSFER")}
                                    value="TRANSFER"
                                    name="target-type-transfer"
                                />
                            }
                            label={t("TRANSFER")}
                        />
                    </Grid>
                )}

                <Grid item xs={12}>
                    {targetContent}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="contained"
                        color="primary"
                        disabled={
                            // target input error
                            this.props.targetError ||
                            // no target input value yet
                            (this.props.target.length <= 0 && this.props.targetType !== "TRANSFER") ||
                            // already loading
                            this.props.payLoading
                        }
                        style={styles.payButton}
                        onClick={this.props.addTarget}
                    >
                        {t("Add")}
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        contacts: state.contacts.contacts,
        contactsLoading: state.contacts.loading,

        payments: state.payments.payments
    };
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

TargetSelection.propTypes = {
    disabledTypes: PropTypes.array,

    addTarget: PropTypes.func.isRequired,
    removeTarget: PropTypes.func.isRequired,
    handleChange: PropTypes.func.isRequired,
    handleChangeDirect: PropTypes.func.isRequired
};
TargetSelection.defaultProps = {
    disabledTypes: []
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(TargetSelection));
