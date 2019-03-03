import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";

const styles = {
    paper: {
        padding: 16,
        marginTop: 16
    },
    textField: {
        width: "100%"
    },
    gridItem: {
        padding: 8
    }
};

class BillingInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,

            billingContractSubscriptions: []
        };
    }

    componentDidMount() {
        this.loadBillingInfo();
    }

    loadBillingInfo = () => {
        const { t, user, BunqJSClient } = this.props;

        const errorMessage = t("We failed to update load the billing information");
        this.setState({ loading: true });

        BunqJSClient.api.billingContractSubscription
            .list(user.id)
            .then(response => {
                this.setState({ loading: false, billingContractSubscriptions: response });
            })
            .catch(error => {
                this.setState({ loading: false });
                this.props.BunqErrorHandler(error, errorMessage);
            });
    };

    render() {
        const { t, user } = this.props;

        const billingComponents = this.state.billingContractSubscriptions.map(billingContractSubscription => {
            const billingInfo = billingContractSubscription.BillingContractSubscription;
            return (
                <Grid item xs={12}>
                    <Grid container>
                        <Grid item xs={12} sm={6} style={styles.gridItem}>
                            <TextField
                                label={t("Contract start")}
                                value={billingInfo.contract_date_start}
                                style={styles.textField}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} style={styles.gridItem}>
                            <TextField
                                label={t("Contract end")}
                                value={billingInfo.contract_date_end || "-"}
                                style={styles.textField}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6} style={styles.gridItem}>
                            <TextField
                                label={t("Created")}
                                value={billingInfo.created}
                                style={styles.textField}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} style={styles.gridItem}>
                            <TextField
                                label={t("Type")}
                                value={billingInfo.subscription_type}
                                style={styles.textField}
                                InputProps={{
                                    readOnly: true
                                }}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            );
        });

        return (
            <Paper style={styles.paper}>
                <Grid container spacing={16} justify="center">
                    <Grid item xs={12}>
                        <Typography variant="subtitle1">{t("Billing info")}</Typography>
                    </Grid>

                    {billingComponents}
                </Grid>
            </Paper>
        );
    }
}

export default BillingInfo;
