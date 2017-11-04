import React from "react";

import Grid from "material-ui/Grid";
import {  FormControlLabel } from "material-ui/Form";
import Radio from "material-ui/Radio";
import AccountBalanceIcon from "material-ui-icons/AccountBalance";
import EmailIcon from "material-ui-icons/Email";
import PhoneIcon from "material-ui-icons/Phone";

class TargetSelection extends React.Component {
    render() {
        const { targetType } = this.props;

        return (
            <Grid container spacing={24}>
                <Grid item xs={6} sm={4}>
                    <FormControlLabel
                        control={
                            <Radio
                                icon={<AccountBalanceIcon />}
                                checkedIcon={<AccountBalanceIcon />}
                                checked={targetType === "IBAN"}
                                onChange={this.props.setTargetType("IBAN")}
                                value="IBAN"
                                name="target-type-iban"
                            />
                        }
                        label="IBAN"
                    />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <FormControlLabel
                        control={
                            <Radio
                                icon={<EmailIcon />}
                                checkedIcon={<EmailIcon />}
                                color={"accent"}
                                checked={targetType === "EMAIL"}
                                onChange={this.props.setTargetType("EMAIL")}
                                value="EMAIL"
                                name="target-type-email"
                            />
                        }
                        label="EMAIL"
                    />
                </Grid>
                <Grid item xs={6} sm={4}>
                    <FormControlLabel
                        control={
                            <Radio
                                icon={<PhoneIcon />}
                                checkedIcon={<PhoneIcon />}
                                color={"accent"}
                                checked={targetType === "PHONE"}
                                onChange={this.props.setTargetType("PHONE")}
                                value="PHONE"
                                name="target-type-phone"
                            />
                        }
                        label="PHONE"
                    />
                </Grid>
            </Grid>
        );
    }
}

export default TargetSelection;
