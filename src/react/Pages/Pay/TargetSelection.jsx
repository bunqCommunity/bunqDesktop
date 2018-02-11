import React from "react";

import Grid from "material-ui/Grid";
import Radio from "material-ui/Radio";
import Avatar from "material-ui/Avatar";
import Chip from "material-ui/Chip";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";
import { FormControl, FormControlLabel } from "material-ui/Form";

import AccountBalanceIcon from "material-ui-icons/AccountBalance";
import EmailIcon from "material-ui-icons/Email";
import PhoneIcon from "material-ui-icons/Phone";
import CompareArrowsIcon from "material-ui-icons/CompareArrows";

import PhoneFormatInput from "../../Components/FormFields/PhoneFormatInput";
import AccountSelectorDialog from "../../Components/FormFields/AccountSelectorDialog";

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

    render() {
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
                        <Typography type="body1">
                            Phone numbers should contain no spaces and include
                            the land code. For example: +316123456789
                        </Typography>
                        <PhoneFormatInput
                            id="target"
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
                        error={this.props.targetError}
                        fullWidth
                        required
                        id="target"
                        type="email"
                        label="Email"
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
                        error={this.props.targetError}
                        fullWidth
                        required
                        id="target"
                        label="IBAN number"
                        value={this.props.target}
                        onChange={this.props.handleChange("target")}
                    />,
                    <TextField
                        fullWidth
                        required
                        error={this.props.ibanNameError}
                        id="ibanName"
                        label="IBAN name"
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
                    this.props.accounts.map(account => {
                        if (account.MonetaryAccountBank.id === targetValue) {
                            targetValue =
                                account.MonetaryAccountBank.description;
                        }
                    });
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
                    label={targetValue}
                    onDelete={event => this.props.removeTarget(targetKey)}
                />
            );
        });

        return (
            <Grid container spacing={24}>
                <Grid item xs={12}>
                    {chipList}
                </Grid>
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
                <Grid item xs={6} sm={3}>
                    <FormControlLabel
                        control={
                            <Radio
                                icon={<CompareArrowsIcon />}
                                checkedIcon={<CompareArrowsIcon />}
                                color={"secondary"}
                                checked={this.props.targetType === "TRANSFER"}
                                onChange={this.props.setTargetType("TRANSFER")}
                                value="TRANSFER"
                                name="target-type-transfer"
                            />
                        }
                        label="Transfer"
                    />
                </Grid>
                <Grid item xs={12}>
                    {targetContent}
                </Grid>
                <Grid item xs={12}>
                    <Button
                        raised
                        color="primary"
                        disabled={
                            // target input error
                            this.props.targetError ||
                            // no target input value yet
                            this.props.target.length === 0 ||
                            // already loading
                            this.props.payLoading
                        }
                        style={styles.payButton}
                        onClick={this.props.addTarget}
                    >
                        Add target
                    </Button>
                </Grid>
            </Grid>
        );
    }
}

export default TargetSelection;
