import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import NumberFormat from "react-number-format";
import { Typography } from "material-ui";
import { FormControl } from "material-ui/Form";
import AccountSelector from "../Components/AccountSelector";

const styles = {
    payButton: {
        width: "100%"
    },
    formControl: {
        width: "100%"
    },
    paper: {
        padding: 24
    },
    inputs: {}
};

class Pay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedAccount: 0,
            amount: 0,
            description: "",
            target: ""
        };
    }

    handleChange = name => event => {
        this.setState({
            [name]: event.target.value
        });
    };

    render() {
        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - Pay`}</title>
                </Helmet>

                <Grid item xs={12} sm={3} md={4} />
                <Grid item xs={12} sm={6} md={4}>
                    <Paper style={styles.paper}>
                        <Typography type="headline">New Payment</Typography>

                        <AccountSelector
                            value={this.state.selectedAccount}
                            onChange={this.handleChange("selectedAccount")}
                            accounts={this.props.accounts}
                            BunqJSClient={this.props.BunqJSClient}
                        />

                        <FormControl style={styles.formControl}>
                            <TextField
                                fullWidth
                                required
                                id="target"
                                label="IBAN, email, or phone"
                                value={this.state.target}
                                style={styles.inputs}
                                onChange={this.handleChange("target")}
                                margin="normal"
                            />
                        </FormControl>

                        <FormControl style={styles.formControl}>
                            <TextField
                                fullWidth
                                id="description"
                                label="Description"
                                value={this.state.description}
                                style={styles.inputs}
                                onChange={this.handleChange("description")}
                                margin="normal"
                            />
                        </FormControl>

                        <FormControl style={styles.formControl}>
                            <NumberFormat
                                fullWidth
                                required
                                id="amount"
                                label="Amount"
                                value={this.state.amount}
                                style={styles.inputs}
                                onChange={this.handleChange("amount")}
                                margin="normal"
                                decimalSeparator={"."}
                                decimalPrecision={2}
                                thousandSeparator={true}
                                prefix={"€"}
                                customInput={TextField}
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
