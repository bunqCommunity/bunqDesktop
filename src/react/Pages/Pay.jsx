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
import { preferedSeparator } from "../Helpers/Utils";
import AccountSelectorDialog from "../Components/AccountSelectorDialog";

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
    formattedInput: {
        fontSize: 30
    }
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
    handleChangeDirect = name => value => {
        this.setState({
            [name]: value
        });
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

                        <FormControl style={styles.formControl}>
                            <TextField
                                fullWidth
                                required
                                id="target"
                                label="IBAN, email, or phone"
                                value={this.state.target}
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
                                decimalSeparator={preferedSeparator}
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
