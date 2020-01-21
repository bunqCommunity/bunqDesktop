import React from "react";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import IconButton from "@material-ui/core/IconButton";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Collapse from "@material-ui/core/Collapse";

import DeleteIcon from "@material-ui/icons/Delete";
import TranslateButton from "../../Components/TranslationHelpers/Button";

const styles = {
    paper: {
        padding: 16,
        marginTop: 16
    },
    fullwidth: {
        width: "100%"
    },
    rowCell: {
        padding: "4px 0px"
    },
    rowDeleteButtonCell: {
        width: 20,
        padding: "4px 8px"
    },
    addButtonWrapper: {
        display: "flex",
        justifyContent: "center"
    }
};

class NotificationFilters extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            showPushesMessages: false,

            newCallbackUrl: "",
            newCallbackCategory: "MUTATION"
        };
    }

    onChange = key => event => {
        this.setState({
            [key]: event.target.value
        });
    };

    // updateNotificationFilters = notificationsList => {
    //     const { t, user, userType, BunqJSClient } = this.props;
    //
    //     const errorMessage = t("We failed to update your user information");
    //     this.setState({ loading: true });
    //
    //     const userInfo = {
    //         notification_filters: notificationsList
    //     };
    //
    //     const apiHandler = userType === "UserPerson" ? BunqJSClient.api.userPerson : BunqJSClient.api.userCompany;
    //
    //     apiHandler
    //         .put(user.id, userInfo)
    //         .then(response => {
    //             this.setState({ loading: false });
    //             this.props.usersUpdate(true);
    //         })
    //         .catch(error => {
    //             this.setState({ loading: false });
    //             this.props.BunqErrorHandler(error, errorMessage);
    //         });
    // };
    // deleteNotification = index => event => {
    //     const notificationFilters = [...this.props.user.notification_filters];
    //     notificationFilters.splice(index, 1);
    //
    //     this.updateNotificationFilters(notificationFilters);
    // };
    // addNotification = event => {
    //     const notificationFilters = [...this.props.user.notification_filters];
    //     notificationFilters.push({
    //         notification_delivery_method: "URL",
    //         category: this.state.newCallbackCategory,
    //         notification_target: this.state.newCallbackUrl
    //     });
    //
    //     this.updateNotificationFilters(notificationFilters);
    // };

    render() {
        const { t, user } = this.props;

        if (!user.notification_filters) return null;

        const notificationFilterTable = (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t("Category")}</TableCell>
                        <TableCell>{t("Method")}</TableCell>
                        <TableCell>{t("Value")}</TableCell>
                        {/*<TableCell>{""}</TableCell>*/}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {user.notification_filters.map((notificationFilter, index) => {
                        if (notificationFilter.notification_delivery_method === "PUSH") return null;
                        return (
                            <TableRow key={index}>
                                <TableCell style={styles.rowCell}>{notificationFilter.category}</TableCell>
                                <TableCell style={styles.rowCell}>
                                    {notificationFilter.notification_delivery_method}
                                </TableCell>
                                <TableCell style={styles.rowCell}>
                                    {notificationFilter.notification_target}
                                    {/*<TextField value={notificationFilter.notification_target} />*/}
                                </TableCell>
                                {/*<TableCell style={styles.rowDeleteButtonCell}>*/}
                                {/*    <IconButton onClick={this.deleteNotification(index)}>*/}
                                {/*        <DeleteIcon />*/}
                                {/*    </IconButton>*/}
                                {/*</TableCell>*/}
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
        const pushNotificationFilterTable = (
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>{t("Category")}</TableCell>
                        <TableCell>{t("Delivery method")}</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {user.notification_filters
                        .filter(notificationFilter => notificationFilter.notification_delivery_method === "PUSH")
                        .sort((a, b) => (a.category < b.category ? -1 : 1))
                        .map((notificationFilter, index) => {
                            return (
                                <TableRow key={index}>
                                    <TableCell>{notificationFilter.category}</TableCell>
                                    <TableCell>{notificationFilter.notification_delivery_method}</TableCell>
                                </TableRow>
                            );
                        })}
                </TableBody>
            </Table>
        );

        return (
            <React.Fragment>
                <Paper style={styles.paper}>
                    <Grid container spacing={16} justify="center">
                        <Grid item xs={12}>
                            <Typography variant="subtitle1">{t("Notification filters")}</Typography>
                        </Grid>

                        {/*<Grid item xs={4} sm={5}>*/}
                        {/*    <TextField*/}
                        {/*        style={styles.fullwidth}*/}
                        {/*        label="Callback URL"*/}
                        {/*        name="newCallbackUrl"*/}
                        {/*        placeholder="https://example.com/callback"*/}
                        {/*        value={this.state.newCallbackUrl}*/}
                        {/*        onChange={this.onChange("newCallbackUrl")}*/}
                        {/*    />*/}
                        {/*</Grid>*/}
                        {/*<Grid item xs={4} sm={5}>*/}
                        {/*    <FormControl style={styles.fullwidth}>*/}
                        {/*        <InputLabel shrink htmlFor="newCallbackCategory">*/}
                        {/*            {t("Category")}*/}
                        {/*        </InputLabel>*/}
                        {/*        <Select*/}
                        {/*            style={styles.fullwidth}*/}
                        {/*            value={this.state.newCallbackCategory}*/}
                        {/*            onChange={this.onChange("newCallbackCategory")}*/}
                        {/*            input={<Input name="newCallbackCategory" id="newCallbackCategory" />}*/}
                        {/*        >*/}
                        {/*            <MenuItem value={"MUTATION"}>MUTATION</MenuItem>*/}
                        {/*            <MenuItem value={"PAYMENT"}>PAYMENT</MenuItem>*/}
                        {/*            <MenuItem value={"IDEAL"}>IDEAL</MenuItem>*/}
                        {/*            <MenuItem value={"SOFORT"}>SOFORT</MenuItem>*/}
                        {/*            <MenuItem value={"BILLING"}>BILLING</MenuItem>*/}
                        {/*            <MenuItem value={"REQUEST"}>REQUEST</MenuItem>*/}
                        {/*            <MenuItem value={"CARD_TRANSACTION_SUCCESSFUL"}>*/}
                        {/*                CARD_TRANSACTION_SUCCESSFUL*/}
                        {/*            </MenuItem>*/}
                        {/*            <MenuItem value={"CHAT"}>CHAT</MenuItem>*/}
                        {/*            <MenuItem value={"DRAFT_PAYMENT"}>DRAFT_PAYMENT</MenuItem>*/}
                        {/*            <MenuItem value={"SCHEDULE_RESULT"}>SCHEDULE_RESULT</MenuItem>*/}
                        {/*            <MenuItem value={"SCHEDULE_STATUS"}>SCHEDULE_STATUS</MenuItem>*/}
                        {/*            <MenuItem value={"SHARE"}>SHARE</MenuItem>*/}
                        {/*            <MenuItem value={"TAB_RESULT"}>TAB_RESULT</MenuItem>*/}
                        {/*            <MenuItem value={"BUNQME_TAB"}>BUNQME_TAB</MenuItem>*/}
                        {/*            <MenuItem value={"SUPPORT"}>SUPPORT</MenuItem>*/}
                        {/*            <MenuItem value={"CARD_TRANSACTION_FAILED"}>CARD_TRANSACTION_FAILED</MenuItem>*/}
                        {/*        </Select>*/}
                        {/*    </FormControl>*/}
                        {/*</Grid>*/}
                        {/*<Grid item xs={4} sm={2} style={styles.addButtonWrapper}>*/}
                        {/*    <TranslateButton*/}
                        {/*        style={styles.fullwidth}*/}
                        {/*        disabled={this.state.loading || this.state.newCallbackUrl.length === 0}*/}
                        {/*        onClick={this.addNotification}*/}
                        {/*        variant="outlined"*/}
                        {/*        color="primary"*/}
                        {/*    >*/}
                        {/*        Add*/}
                        {/*    </TranslateButton>*/}
                        {/*</Grid>*/}

                        <Grid item xs={12}>
                            {notificationFilterTable}
                        </Grid>
                    </Grid>
                </Paper>

                <Paper style={styles.paper}>
                    <Grid container spacing={16} justify="center">
                        <Grid item xs={8}>
                            <Typography variant="subtitle1">{t("Push notifications")}</Typography>
                        </Grid>
                        <Grid item xs={4}>
                            <Button
                                style={styles.fullwidth}
                                variant="outlined"
                                onClick={() => this.setState({ showPushesMessages: !this.state.showPushesMessages })}
                            >
                                {this.state.showPushesMessages ? t("Hide") : t("Show")}
                            </Button>
                        </Grid>
                        <Collapse in={this.state.showPushesMessages} style={styles.fullwidth}>
                            <Grid item xs={12}>
                                {pushNotificationFilterTable}
                            </Grid>
                        </Collapse>
                    </Grid>
                </Paper>
            </React.Fragment>
        );
    }
}

export default NotificationFilters;
