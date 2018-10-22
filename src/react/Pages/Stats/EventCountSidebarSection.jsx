import React from "react";
import Paper from "@material-ui/core/Paper";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";

const styles = {
    sideBarPaper: {
        padding: 16,
        marginBottom: 16
    }
};

export default props => {
    const { t, data, splitCardTypes } = props;
    return (
        <Paper style={styles.sideBarPaper}>
            <List dense component="nav">
                <ListItem>
                    <ListItemText primary={t("Payments")} secondary={props.payments.length} />
                </ListItem>
                {splitCardTypes ? (
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
                        <ListItemText primary={t("Card payments")} secondary={props.masterCardActions.length} />
                    </ListItem>
                )}
                <ListItem>
                    <ListItemText primary={t("Requests sent")} secondary={props.requestInquiries.length} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={t("Requests received")} secondary={props.requestResponses.length} />
                </ListItem>
                <ListItem>
                    <ListItemText primary={t("bunqme Requests")} secondary={props.bunqMeTabs.length} />
                </ListItem>
            </List>
        </Paper>
    );
};
