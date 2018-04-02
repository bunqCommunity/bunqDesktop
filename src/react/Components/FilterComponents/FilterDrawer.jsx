import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import DatePicker from "material-ui-pickers/DatePicker/index.js";
import { withTheme } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import Icon from "material-ui/Icon";
import Button from "material-ui/Button";
import Drawer from "material-ui/Drawer";
import Divider from "material-ui/Divider";
import InputAdornment from "material-ui/Input/InputAdornment";
import Typography from "material-ui/Typography";
import Radio, { RadioGroup } from "material-ui/Radio";
import List, {
    ListItem,
    ListSubheader,
    ListItemIcon,
    ListItemSecondaryAction
} from "material-ui/List";

import FilterListIcon from "material-ui-icons/FilterList";
import CompareArrowsIcon from "material-ui-icons/CompareArrows";
import ArrowUpward from "material-ui-icons/ArrowUpward";
import ArrowDownward from "material-ui-icons/ArrowDownward";
import Visible from "material-ui-icons/Visibility";
import VisibleOff from "material-ui-icons/VisibilityOff";
import ClearIcon from "material-ui-icons/Clear";
import CheckCircle from "material-ui-icons/CheckCircle";
import TimerOff from "material-ui-icons/TimerOff";
import Cancel from "material-ui-icons/Cancel";

import {
    clearPaymentFilterType,
    togglePaymentFilterVisibility,
    setPaymentFilterType,
    clearRequestFilterType,
    toggleRequestFilterVisibility,
    setRequestFilterType,
    clearBunqMeTabFilterType,
    toggleBunqMeTabFilterVisibility,
    setBunqMeTabFilterType,
    setFromDateFilter,
    setToDateFilter,
    clearFromDateFilter,
    clearToDateFilter
} from "../../Actions/filters";

const styles = {
    list: {
        width: 250,
        paddingBottom: 50,
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        WebkitAppRegion: "no-drag",
        flexGrow: 1
    },
    listItem: {
        paddingTop: 0,
        paddingBottom: 0
    },
    radioListItem: {
        paddingTop: 0,
        paddingBottom: 0,
        height: 38
    },
    subheaderTitle: {
        height: 40
    },
    listItemFiller: {
        flexGrow: 1
    },
    listFiller: {
        flex: "1 1 100%"
    },
    radioGroup: {
        display: "flex",
        flexDirection: "row"
    },
    radioBtn: {
        flex: 1
    },
    checked: {
        color: "green"
    },
    dateInput: {
        width: 208,
        margin: 5,
        marginBottom: 12,
        marginTop: 8
    }
};

class FilterDrawer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedDateFrom: null,
            selectedDateTo: null,
            open: false
        };
    }

    openDrawer = () => {
        this.setState({ open: true });
    };
    closeDrawer = () => {
        this.setState({ open: false });
    };

    clearAll = () => {
        this.props.clearPaymentFilterType();
        this.props.clearBunqMeTabFilterType();
        this.props.clearRequestFilterType();
        this.props.clearFromDateFilter();
        this.props.clearToDateFilter();
    };

    handlePaymentTypeChange = event => {
        this.props.setPaymentFilterType(event.target.value);
    };
    togglePaymentVisibilityChange = () => {
        this.props.togglePaymentFilterVisibility();
    };

    handleRequestTypeChange = event => {
        this.props.setRequestFilterType(event.target.value);
    };
    toggleRequestVisibilityChange = () => {
        this.props.toggleRequestFilterVisibility();
    };

    handleBunqMeTabChange = event => {
        this.props.setBunqMeTabFilterType(event.target.value);
    };
    toggleBunqMeTabVisibilityChange = () => {
        this.props.toggleBunqMeTabFilterVisibility();
    };

    handleDateFromChange = date => {
        this.props.setFromDateFilter(date);
    };
    handleDateToChange = date => {
        this.props.setToDateFilter(date);
    };
    clearDateFrom = event => {
        this.props.clearFromDateFilter();
    };
    clearDateTo = event => {
        this.props.clearToDateFilter();
    };

    render() {
        const {
            theme,
            paymentType,
            paymentVisibility,
            requestType,
            requestVisibility,
            bunqMeTabType,
            bunqMeTabVisibility,
            t
        } = this.props;
        const { sentPayment, receivedPayment } = theme.palette.common;

        const drawerList = (
            <List style={styles.list}>
                {/* filters for both normal payments and master card actions */}
                <ListSubheader style={styles.subheaderTitle}>
                    {t("Payments")}
                    <ListItemSecondaryAction>
                        <IconButton
                            aria-label="Display or hide all payments"
                            onClick={this.togglePaymentVisibilityChange}
                        >
                            {paymentVisibility ? <Visible /> : <VisibleOff />}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListSubheader>
                <ListItem style={styles.radioListItem}>
                    <RadioGroup
                        name="payment-type"
                        style={styles.radioGroup}
                        value={paymentType}
                        onChange={this.handlePaymentTypeChange}
                    >
                        <Radio
                            style={styles.radioBtn}
                            icon={<CompareArrowsIcon />}
                            checkedIcon={
                                <CompareArrowsIcon color={"primary"} />
                            }
                            value={"default"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<ArrowDownward />}
                            checkedIcon={
                                <ArrowDownward
                                    style={{ color: receivedPayment }}
                                    color={"inherit"}
                                />
                            }
                            value={"received"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<ArrowUpward />}
                            checkedIcon={
                                <ArrowUpward
                                    style={{ color: sentPayment }}
                                    color={"inherit"}
                                />
                            }
                            value={"sent"}
                        />
                    </RadioGroup>
                </ListItem>

                {/* filters for both request-responses and request-requests*/}
                <ListSubheader style={styles.subheaderTitle}>
                    {t("Requests")}
                    <ListItemSecondaryAction>
                        <IconButton
                            aria-label="Display or hide all requests"
                            onClick={this.toggleRequestVisibilityChange}
                        >
                            {requestVisibility ? <Visible /> : <VisibleOff />}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListSubheader>
                <ListItem style={styles.radioListItem}>
                    <RadioGroup
                        name="request-type"
                        style={styles.radioGroup}
                        value={requestType}
                        onChange={this.handleRequestTypeChange}
                    >
                        <Radio
                            style={styles.radioBtn}
                            icon={<CompareArrowsIcon />}
                            checkedIcon={
                                <CompareArrowsIcon color={"primary"} />
                            }
                            value={"default"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<ArrowDownward />}
                            checkedIcon={
                                <ArrowDownward
                                    style={{ color: sentPayment }}
                                    color={"inherit"}
                                />
                            }
                            value={"received"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<ArrowUpward />}
                            checkedIcon={
                                <ArrowUpward
                                    style={{ color: receivedPayment }}
                                    color={"inherit"}
                                />
                            }
                            value={"sent"}
                        />
                    </RadioGroup>
                </ListItem>

                {/* filters bunq.me tabs */}
                <ListSubheader style={styles.subheaderTitle}>
                    {t("bunqme Requests")}
                    <ListItemSecondaryAction>
                        <IconButton
                            aria-label="Display or hide all bunq.me requests"
                            onClick={this.toggleBunqMeTabVisibilityChange}
                        >
                            {bunqMeTabVisibility ? <Visible /> : <VisibleOff />}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListSubheader>
                <ListItem style={styles.radioListItem}>
                    <RadioGroup
                        name="bunqmetab-type"
                        style={styles.radioGroup}
                        value={bunqMeTabType}
                        onChange={this.handleBunqMeTabChange}
                    >
                        <Radio
                            style={styles.radioBtn}
                            icon={<CompareArrowsIcon />}
                            checkedIcon={
                                <CompareArrowsIcon color={"primary"} />
                            }
                            value={"default"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<CheckCircle />}
                            checkedIcon={
                                <CheckCircle
                                    style={{
                                        color:
                                            theme.palette.bunqMeTabs
                                                .awaiting_payment
                                    }}
                                    color={"inherit"}
                                />
                            }
                            value={"active"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<Cancel />}
                            checkedIcon={
                                <Cancel
                                    style={{
                                        color:
                                            theme.palette.bunqMeTabs.cancelled
                                    }}
                                    color={"inherit"}
                                />
                            }
                            value={"cancelled"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<TimerOff />}
                            checkedIcon={
                                <TimerOff
                                    style={{
                                        color: theme.palette.bunqMeTabs.expired
                                    }}
                                    color={"inherit"}
                                />
                            }
                            value={"expired"}
                        />
                    </RadioGroup>
                </ListItem>

                <ListSubheader style={styles.subheaderTitle}>
                    {t("Date range filter")}
                </ListSubheader>
                <ListItem style={styles.listItem}>
                    <DatePicker
                        id="from-date"
                        helperText={t("From date")}
                        emptyLabel={t("No filter")}
                        format="MMMM DD, YYYY"
                        disableFuture
                        style={styles.dateInput}
                        maxDate={this.props.dateToFilter}
                        value={this.props.dateFromFilter}
                        onChange={this.handleDateFromChange}
                        clearable={true}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={this.clearDateFrom}>
                                        <Icon>clear</Icon>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </ListItem>
                <ListItem style={styles.listItem}>
                    <DatePicker
                        id="to-date"
                        helperText={t("To date")}
                        emptyLabel={t("No filter")}
                        format="MMMM DD, YYYY"
                        disableFuture
                        style={styles.dateInput}
                        minDate={this.props.dateFromFilter}
                        value={this.props.dateToFilter}
                        onChange={this.handleDateToChange}
                        clearable={true}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton onClick={this.clearDateTo}>
                                        <Icon>clear</Icon>
                                    </IconButton>
                                </InputAdornment>
                            )
                        }}
                    />
                </ListItem>

                <ListItem style={styles.listFiller} />

                <Divider />
                <ListItem button onClick={this.clearAll}>
                    <ListItemIcon>
                        <ClearIcon />
                    </ListItemIcon>
                    <Typography variant="subheading">
                        {t("Clear filters")}
                    </Typography>
                </ListItem>
            </List>
        );

        const button = this.props.bigButton ? (
            <Button
                variant="raised"
                key={"button"}
                onClick={this.openDrawer}
                {...this.props.buttonProps}
            >
                {t("Filter")} <FilterListIcon />
            </Button>
        ) : (
            <IconButton
                key={"iconbutton"}
                onClick={this.openDrawer}
                {...this.props.buttonProps}
            >
                <FilterListIcon />
            </IconButton>
        );

        return [
            button,
            <Drawer
                key={"drawer"}
                open={this.state.open}
                className="options-drawer"
                onClose={this.closeDrawer}
                anchor="right"
                SlideProps={{
                    style: { top: 50 }
                }}
            >
                {drawerList}
            </Drawer>
        ];
    }
}

FilterDrawer.defaultProps = {
    bigButton: false,
    buttonProps: {},
    buttonContent: null
};

const mapStateToProps = state => {
    return {
        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,

        bunqMeTabType: state.bunq_me_tab_filter.type,
        bunqMeTabVisibility: state.bunq_me_tab_filter.visible,

        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible,

        dateFromFilter: state.date_filter.from_date,
        dateToFilter: state.date_filter.to_date
    };
};

const mapDispatchToProps = dispatch => {
    return {
        clearPaymentFilterType: () => dispatch(clearPaymentFilterType()),
        setPaymentFilterType: type => dispatch(setPaymentFilterType(type)),
        togglePaymentFilterVisibility: () =>
            dispatch(togglePaymentFilterVisibility()),

        clearRequestFilterType: () => dispatch(clearRequestFilterType()),
        setRequestFilterType: type => dispatch(setRequestFilterType(type)),
        toggleRequestFilterVisibility: () =>
            dispatch(toggleRequestFilterVisibility()),

        clearBunqMeTabFilterType: () => dispatch(clearBunqMeTabFilterType()),
        setBunqMeTabFilterType: type => dispatch(setBunqMeTabFilterType(type)),
        toggleBunqMeTabFilterVisibility: () =>
            dispatch(toggleBunqMeTabFilterVisibility()),

        setFromDateFilter: date => dispatch(setFromDateFilter(date)),
        setToDateFilter: date => dispatch(setToDateFilter(date)),
        clearFromDateFilter: () => dispatch(clearFromDateFilter()),
        clearToDateFilter: () => dispatch(clearToDateFilter())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withTheme()(translate("translations")(FilterDrawer))
);
