import React from "react";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";

const styles = {
    sideBarPaper: {
        padding: 16,
        marginBottom: 16
    }
};

export default props => {
    return (
        <Paper style={styles.sideBarPaper}>
            <List dense component="nav">
                <ListItem>
                    <ListItemText primary={t("Payments")} secondary={this.props.payments.length} />
                </ListItem>
                {this.state.splitCardTypes ? (
                    <React.Fragment>
                        <ListItem>
                            <ListItemText
                                primary={t("MasterCard payments")}
                                secondary={data.masterCardPaymentCountHistory.reduce((a, b) => a + b, 0)}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={t("Maestro payments")}
                                secondary={data.maestroPaymentCountHistory.reduce((a, b) => a + b, 0)}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={t("Tap & Pay payments")}
                                secondary={data.tapAndPayPaymentCountHistory.reduce((a, b) => a + b, 0)}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={t("Apple Pay payments")}
                                secondary={data.applePayPaymentCountHistory.reduce((a, b) => a + b, 0)}
                            />
                        </ListItem>
                    </React.Fragment>
                ) : (
                    <ListItem>
                        <ListItemText primary={t("Card payments")} secondary={this.props.masterCardActions.length} />
                    </ListItem>
                )}
                <ListItem>
                    <ListItemText primary={t("Requests sent")} secondary={this.props.requestInquiries.length} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={t("Requests received")} secondary={this.props.requestResponses.length} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={t("bunqme Requests")} secondary={this.props.bunqMeTabs.length} />
                </ListItem>
            </List>
        </Paper>
    );
};
