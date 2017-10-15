import React from "react";
import { withTheme } from "material-ui/styles";
import IconButton from "material-ui/IconButton";
import Drawer from "material-ui/Drawer";
import Radio, { RadioGroup } from "material-ui/Radio";
import List, { ListItem, ListSubheader, ListItemIcon } from "material-ui/List";

import FilterListIcon from "material-ui-icons/FilterList";
import CompareArrowsIcon from "material-ui-icons/CompareArrows";
import ArrowForwardIcon from "material-ui-icons/ArrowForward";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import ClearIcon from "material-ui-icons/Clear";
import { Divider } from "material-ui";
import { connect } from "react-redux";
import {
    clearPaymentFilterType,
    rotatePaymentFilterType,
    setPaymentFilterType
} from "../../Actions/payment_filter";

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

    handleTypeChange = event => {
        this.props.setPaymentFilterType(event.target.value);
    };

    render() {
        const { theme, paymentType } = this.props;
        const { sentPayment, receivedPayment } = theme.palette.common;

        const drawerList = (
            <List style={styles.list}>
                <ListSubheader>Payment Type</ListSubheader>
                <ListItem style={styles.listItem}>
                    <RadioGroup
                        name="payment-type"
                        style={styles.radioGroup}
                        value={paymentType}
                        onChange={this.handleTypeChange}
                    >
                        <Radio
                            style={styles.radioBtn}
                            icon={<CompareArrowsIcon />}
                            checkedIcon={<CompareArrowsIcon />}
                            value={"default"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<ArrowBackIcon />}
                            checkedIcon={
                                <ArrowBackIcon color={receivedPayment} />
                            }
                            value={"received"}
                        />
                        <Radio
                            style={styles.radioBtn}
                            icon={<ArrowForwardIcon />}
                            checkedIcon={<ArrowForwardIcon color={sentPayment} />}
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
                onRequestClose={this.closeDrawer}
                anchor="right"
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
        rotatePaymentFilterType: () => dispatch(rotatePaymentFilterType()),
        setPaymentFilterType: type => dispatch(setPaymentFilterType(type))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withTheme(DisplayDrawer)
);
