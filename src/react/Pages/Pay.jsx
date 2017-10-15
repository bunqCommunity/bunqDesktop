import React from "react";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Paper from "material-ui/Paper";
import NumberFormat from "react-number-format";

const styles = {
    payButton: {
        width: "100%"
    },
    paper: {
        padding: 24
    },
    inputs: {}
};

export default class Pay extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
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
                    <title>{`BunqWeb - Pay`}</title>
                </Helmet>

                <Grid item xs={12} md={4} />
                <Grid item xs={12} md={4}>
                    <Paper style={styles.paper}>
                        <h3>New Payment</h3>

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
                        <TextField
                            fullWidth
                            id="description"
                            label="Description"
                            value={this.state.description}
                            style={styles.inputs}
                            onChange={this.handleChange("description")}
                            margin="normal"
                        />

                        <NumberFormat
                            fullWidth
                            required
                            id="amount"
                            label="Amount"
                            value={this.state.amount}
                            style={styles.inputs}
                            onChange={this.handleChange("amount")}
                            margin="normal"
                            decimalSeparator={'.'}
                            decimalPrecision={2}
                            thousandSeparator={true}
                            prefix={"€"}
                            customInput={TextField}
                        />

                        <Button raised color="primary"
                                style={styles.payButton}>
                            Pay
                        </Button>
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}
