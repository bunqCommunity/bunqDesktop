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
                    <ListItemText
                        primary={t("Payments")}
                        secondary={props.events.filter(event => event.type === "Payment").length}
                    />
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
                        <ListItemText
                            primary={t("Card payments")}
                            secondary={props.events.filter(event => event.type === "MasterCardAction").length}
                        />
                    </ListItem>
                )}
                <ListItem>
                    <ListItemText
                        primary={t("Requests sent")}
                        secondary={props.events.filter(event => event.type === "RequestInquiry").length}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t("Requests received")}
                        secondary={props.events.filter(event => event.type === "RequestResponse").length}
                    />
                </ListItem>
                <ListItem>
                    <ListItemText
                        primary={t("bunqme Requests")}
                        secondary={props.events.filter(event => event.type === "BunqMeTab").length}
                    />
                </ListItem>
            </List>
        </Paper>
    );
};
