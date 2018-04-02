import React from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import Grid from "material-ui/Grid";
import Radio from "material-ui/Radio";
import Avatar from "material-ui/Avatar";
import Chip from "material-ui/Chip";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import { FormControl, FormControlLabel } from "material-ui/Form";
import CopyToClipboard from "react-copy-to-clipboard";

import AccountBalanceIcon from "material-ui-icons/AccountBalance";
import EmailIcon from "material-ui-icons/Email";
import PhoneIcon from "material-ui-icons/Phone";
import CompareArrowsIcon from "material-ui-icons/CompareArrows";

import PhoneFormatInput from "./PhoneFormatInput";
import AccountSelectorDialog from "./AccountSelectorDialog";
import { openSnackbar } from "../../Actions/snackbar";
import { translate } from "react-i18next";

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
        this.state = {};
    }

    enterKeySubmit = ev => {
        if (ev.key === "Enter") {
            ev.preventDefault();
            this.props.addTarget();
        }
    };

    copiedValue = type => callback => {
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
                        onChange={this.props.handleChangeDirect(
                            "selectedTargetAccount"
                        )}
                        accounts={this.props.accounts}
                        BunqJSClient={this.props.BunqJSClient}
                    />
                );
                break;
            case "PHONE":
                targetContent = (
                    <FormControl fullWidth error={this.props.targetError}>
                        <Typography variant="body1">
                            {t(
                                "Phone numbers should contain no spaces and include the land code For example 316123456789"
                            )}
                        </Typography>
                        <PhoneFormatInput
                            id="target"
                            autoFocus
                            placeholder="+316123456789"
                            error={this.props.targetError}
                            value={this.props.target}
                            onChange={this.props.handleChange("target")}
                            onKeyPress={this.enterKeySubmit}
                        />
                    </FormControl>
                );
                break;
            case "EMAIL":
                targetContent = (
                    <TextField
                        autoFocus
                        error={this.props.targetError}
                        fullWidth
                        required
                        id="target"
                        type="email"
                        label={t("Email")}
                        value={this.props.target}
                        onChange={this.props.handleChange("target")}
                        onKeyPress={this.enterKeySubmit}
                    />
                );
                break;
            default:
            case "IBAN":
                targetContent = [
                    <TextField
                        autoFocus
                        error={this.props.targetError}
                        fullWidth
                        required
                        id="target"
                        label={t("IBAN number")}
                        value={this.props.target}
                        onChange={this.props.handleChange("target")}
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
                    Icon = EmailIcon;
                    break;
                case "PHONE":
                    Icon = PhoneIcon;
                    break;
                case "TRANSFER":
                    // for transfers we can try to display a description
                    if (this.props.accounts[target.value]) {
                        targetValue = this.props.accounts[target.value]
                            .description;
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
                        <CopyToClipboard
                            text={targetValue}
                            onCopy={this.copiedValue(target.type)}
                        >
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
                {this.props.disabledTypes.includes("EMAIL") ? null : (
                    <Grid item xs={6} sm={3}>
                        <FormControlLabel
                            control={
                                <Radio
                                    icon={<EmailIcon />}
                                    checkedIcon={<EmailIcon />}
                                    color={"secondary"}
                                    checked={this.props.targetType === "EMAIL"}
                                    onChange={this.props.setTargetType("EMAIL")}
                                    value="EMAIL"
                                    name="target-type-email"
                                />
                            }
                            label="EMAIL"
                        />
                    </Grid>
                )}
                {this.props.disabledTypes.includes("PHONE") ? null : (
                    <Grid item xs={6} sm={3}>
                        <FormControlLabel
                            control={
                                <Radio
                                    icon={<PhoneIcon />}
                                    checkedIcon={<PhoneIcon />}
                                    color={"secondary"}
                                    checked={this.props.targetType === "PHONE"}
                                    onChange={this.props.setTargetType("PHONE")}
                                    value="PHONE"
                                    name="target-type-phone"
                                />
                            }
                            label="PHONE"
                        />
                    </Grid>
                )}
                {this.props.disabledTypes.includes("IBAN") ? null : (
                    <Grid item xs={6} sm={3}>
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
                    <Grid item xs={6} sm={3}>
                        <FormControlLabel
                            control={
                                <Radio
                                    icon={<CompareArrowsIcon />}
                                    checkedIcon={<CompareArrowsIcon />}
                                    color={"secondary"}
                                    checked={
                                        this.props.targetType === "TRANSFER"
                                    }
                                    onChange={this.props.setTargetType(
                                        "TRANSFER"
                                    )}
                                    value="TRANSFER"
                                    name="target-type-transfer"
                                />
                            }
                            label="Transfer"
                        />
                    </Grid>
                )}

                <Grid item xs={12}>
                    {targetContent}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        variant="raised"
                        color="primary"
                        disabled={
                            // target input error
                            this.props.targetError ||
                            // no target input value yet
                            (this.props.target.length <= 0 &&
                                this.props.targetType !== "TRANSFER") ||
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
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

TargetSelection.propTypes = {
    disabledTypes: PropTypes.array
};
TargetSelection.defaultProps = {
    disabledTypes: []
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(TargetSelection)
);
