import React from "react";
import { withTheme } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import Drawer from "material-ui/Drawer";
import Radio, { RadioGroup } from "material-ui/Radio";
import List, { ListItem, ListSubheader, ListItemIcon } from "material-ui/List";

import FilterListIcon from "material-ui-icons/FilterList";
import CompareArrowsIcon from "material-ui-icons/CompareArrows";
import ArrowUpward from "material-ui-icons/ArrowUpward";
import ArrowDownward from "material-ui-icons/ArrowDownward";
import ClearIcon from "material-ui-icons/Clear";
import { Divider } from "material-ui";
import { connect } from "react-redux";
import {
    clearPaymentFilterType,
    setPaymentFilterType
} from "../../Actions/payment_filter";
import {clearBunqMeTabFilterType, setBunqMeTabFilterType} from "../../Actions/bunq_me_tab_filter";

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
    }

    handlePaymentTypeChange = event => {
        this.props.setPaymentFilterType(event.target.value);
    };

    handleRequestTypeChange = event => {
        this.props.setPaymentFilterType(event.target.value);
    };

    render() {
        const { theme, paymentType } = this.props;
        const { sentPayment, receivedPayment } = theme.palette.common;

        const drawerList = (
            <List style={styles.list}>
                <ListSubheader>Payments</ListSubheader>
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

                <ListSubheader>Requests</ListSubheader>
                <ListItem style={styles.listItem}>
                    <RadioGroup
                        name="request-type"
                        style={styles.radioGroup}
                        value={paymentType}
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

                <Divider />
                <ListItem button onClick={this.props.clearPaymentFilterType}>
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
        paymentType: state.payment_filter.type
    };
};

const mapDispatchToProps = dispatch => {
    return {
        clearPaymentFilterType: () => dispatch(clearPaymentFilterType()),
        setPaymentFilterType: type => dispatch(setPaymentFilterType(type)),
        clearBunqMeTabFilterType: () => dispatch(clearBunqMeTabFilterType()),
        setBunqMeTabFilterType: type => dispatch(setBunqMeTabFilterType(type))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withTheme()(DisplayDrawer)
);
