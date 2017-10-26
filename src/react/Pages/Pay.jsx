import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import NumberFormat from "react-number-format";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Input, { InputLabel, InputAdornment } from "material-ui/Input";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import IconButton from "material-ui/IconButton";
import Typography from "material-ui/Typography";
import { FormControl } from "material-ui/Form";
import AccountBalanceIcon from "material-ui-icons/AccountBalance";
import EmailIcon from "material-ui-icons/Email";

import {
    preferedThousandSeparator,
    preferedDecimalSeparator
} from "../Helpers/Utils";
import AccountSelectorDialog from "../Components/AccountSelectorDialog";

const styles = {
    payButton: {
        width: "100%"
    },
    formControl: {
        width: "100%"
    },
    paper: {
        padding: 24,
        textAlign: "left"
    },
    formattedInput: {
        fontSize: 30
    }
};

class Pay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedAccount: 0,
            amount: "",
            description: "",
            target: "",
            targetTypeIban: true
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };
    handleChangeDirect = name => value => {
        this.setState({
            [name]: value
        });
    };

    toggleTargetType = event => {
        this.setState({
            targetTypeIban: !this.state.targetTypeIban
        });
    };

    handleMouseDown = event => {
        event.preventDefault();
    };

    paymentTest = async () => {
        const { BunqJSClient, accounts } = this.props;
        const {
            selectedAccount,
            description,
            target,
            targetTypeIban
        } = this.state;
        const account = accounts[selectedAccount];

        this.props.BunqJSClient.api.payment.post();
    };
    render() {
        return (
            <Grid container spacing={24} align={"center"} justify={"center"}>
                <Helmet>
                    <title>{`BunqDesktop - Pay`}</title>
                </Helmet>

                <Grid item xs={12} sm={10} md={8} lg={6}>
                    <Paper style={styles.paper}>
                        <Typography type="headline">New Payment</Typography>

                        <AccountSelectorDialog
                            value={this.state.selectedAccount}
                            onChange={this.handleChangeDirect(
                                "selectedAccount"
                            )}
                            accounts={this.props.accounts}
                            BunqJSClient={this.props.BunqJSClient}
                        />

                        <FormControl fullWidth>
                            <InputLabel htmlFor="target">
                                {this.state.targetTypeIban ? "IBAN" : "Email"}
                            </InputLabel>
                            <Input
                                fullWidth
                                id="target"
                                value={this.state.target}
                                onChange={this.handleChange("target")}
                                endAdornment={
                                    <InputAdornment position="end">
                                        <IconButton
                                            onClick={this.toggleTargetType}
                                            onMouseDown={this.handleMouseDown}
                                        >
                                            {this.state.targetTypeIban ? (
                                                <AccountBalanceIcon />
                                            ) : (
                                                <EmailIcon />
                                            )}
                                        </IconButton>
                                    </InputAdornment>
                                }
                            />
                        </FormControl>

                        <FormControl style={styles.formControl}>
                            <TextField
                                fullWidth
                                id="description"
                                label="Description"
                                value={this.state.description}
                                onChange={this.handleChange("description")}
                                margin="normal"
                            />
                        </FormControl>

                        <FormControl style={styles.formControl}>
                            <NumberFormat
                                required
                                id="amount"
                                value={this.state.amount}
                                style={styles.formattedInput}
                                onChange={this.handleChange("amount")}
                                margin="normal"
                                decimalPrecision={2}
                                decimalSeparator={preferedDecimalSeparator}
                                thousandSeparator={preferedThousandSeparator}
                                prefix={"€"}
                                customInput={Input}
                            />
                        </FormControl>

                        <Button raised color="primary" style={styles.payButton}>
                            Pay
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Pay);
