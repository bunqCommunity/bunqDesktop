import React from "react";
import { withTheme } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import Drawer from "material-ui/Drawer";
import TextField from "material-ui/TextField";
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

import { Divider } from "material-ui";
import { connect } from "react-redux";
import {
    clearPaymentFilterType,
    togglePaymentFilterVisibility,
    setPaymentFilterType
} from "../../Actions/payment_filter";
import {
    clearBunqMeTabFilterType,
    toggleBunqMeTabFilterVisibility,
    setBunqMeTabFilterType
} from "../../Actions/bunq_me_tab_filter";
import {
    clearRequestFilterType,
    toggleRequestFilterVisibility,
    setRequestFilterType
} from "../../Actions/request_filter";

const styles = {
    list: {
        width: 250
    },
    listItem: {
        paddingTop: 0,
        paddingBottom: 0
    },
    listItemFiller: {
        flexGrow: 1
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
    }
};

class DisplayDrawer extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
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

    render() {
        const {
            theme,
            paymentType,
            paymentVisibility,
            requestType,
            requestVisibility,
            bunqMeTabType,
            bunqMeTabVisibility
        } = this.props;
        const { sentPayment, receivedPayment } = theme.palette.common;

        const drawerList = (
            <List style={styles.list}>
                {/* filters for both normal payments and master card actions */}
                <ListSubheader>
                    Payments
                    <ListItemSecondaryAction>
                        <IconButton
                            aria-label="Display or hide all payments"
                            onClick={this.togglePaymentVisibilityChange}
                        >
                            {paymentVisibility ? <Visible /> : <VisibleOff />}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListSubheader>
                <ListItem style={styles.listItem}>
                    <RadioGroup
                        name="payment-type"
                        style={styles.radioGroup}
                        value={paymentType}
                        onChange={this.handlePaymentTypeChange}
                    >
                        <Radio
                            style={styles.radioBtn}
                            icon={<CompareArrowsIcon />}
                            checkedIcon={<CompareArrowsIcon />}
                            value={"default"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<ArrowDownward />}
                            checkedIcon={
                                <ArrowDownward color={receivedPayment} />
                            }
                            value={"received"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<ArrowUpward />}
                            checkedIcon={<ArrowUpward color={sentPayment} />}
                            value={"sent"}
                        />
                    </RadioGroup>
                </ListItem>

                {/* filters for both request-responses and request-requests*/}
                <ListSubheader>
                    Requests
                    <ListItemSecondaryAction>
                        <IconButton
                            aria-label="Display or hide all requests"
                            onClick={this.toggleRequestVisibilityChange}
                        >
                            {requestVisibility ? <Visible /> : <VisibleOff />}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListSubheader>
                <ListItem style={styles.listItem}>
                    <RadioGroup
                        name="request-type"
                        style={styles.radioGroup}
                        value={requestType}
                        onChange={this.handleRequestTypeChange}
                    >
                        <Radio
                            style={styles.radioBtn}
                            icon={<CompareArrowsIcon />}
                            checkedIcon={<CompareArrowsIcon />}
                            value={"default"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<ArrowDownward />}
                            checkedIcon={
                                <ArrowDownward color={receivedPayment} />
                            }
                            value={"received"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<ArrowUpward />}
                            checkedIcon={<ArrowUpward color={sentPayment} />}
                            value={"sent"}
                        />
                    </RadioGroup>
                </ListItem>

                {/* filters bunq.me tabs */}
                <ListSubheader>
                    bunq.me requests
                    <ListItemSecondaryAction>
                        <IconButton
                            aria-label="Display or hide all bunq.me requests"
                            onClick={this.toggleBunqMeTabVisibilityChange}
                        >
                            {bunqMeTabVisibility ? <Visible /> : <VisibleOff />}
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListSubheader>
                <ListItem style={styles.listItem}>
                    <RadioGroup
                        name="bunqmetab-type"
                        style={styles.radioGroup}
                        value={bunqMeTabType}
                        onChange={this.handleBunqMeTabChange}
                    >
                        <Radio
                            style={styles.radioBtn}
                            icon={<CompareArrowsIcon />}
                            checkedIcon={<CompareArrowsIcon />}
                            value={"default"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<CheckCircle />}
                            checkedIcon={
                                <CheckCircle
                                    color={
                                        theme.palette.bunqMeTabs
                                            .awaiting_payment
                                    }
                                />
                            }
                            value={"active"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<Cancel />}
                            checkedIcon={
                                <Cancel
                                    color={theme.palette.bunqMeTabs.cancelled}
                                />
                            }
                            value={"cancelled"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<TimerOff />}
                            checkedIcon={
                                <TimerOff
                                    color={theme.palette.bunqMeTabs.expired}
                                />
                            }
                            value={"expired"}
                        />
                    </RadioGroup>
                </ListItem>

                <ListItem style={styles.listItem}>
                    <TextField
                        id="from-datetime"
                        label="From"
                        type="datetime-local"
                    />
                </ListItem>
                <ListItem style={styles.listItem}>
                    <TextField
                        id="to-datetime"
                        label="To"
                        type="datetime-local"
                    />
                </ListItem>

                <Divider />
                <ListItem button onClick={this.clearAll}>
                    <ListItemIcon>
                        <ClearIcon />
                    </ListItemIcon>
                    Clear filters
                </ListItem>
            </List>
        );

        return [
            <IconButton onClick={this.openDrawer}>
                <FilterListIcon />
            </IconButton>,
            <Drawer
                open={this.state.open}
                className="options-drawer"
                onRequestClose={this.closeDrawer}
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

const mapStateToProps = state => {
    return {
        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,

        bunqMeTabType: state.bunq_me_tab_filter.type,
        bunqMeTabVisibility: state.bunq_me_tab_filter.visible,

        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible
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
            dispatch(toggleBunqMeTabFilterVisibility())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withTheme()(DisplayDrawer)
);
