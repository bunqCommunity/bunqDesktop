import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "@material-ui/core/styles";

class MoneyAmountLabel extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.theme.themeName !== this.props.theme.themeName)
            return true;
        if (nextProps.children !== this.props.children) return true;
        if (nextProps.type !== this.props.type) return true;
        if (nextProps.status !== this.props.status) return true;
        if (nextProps.amount !== this.props.amount) return true;

        return false;
    }

    checkRequestResponse = () => {
        const { theme, style, info } = this.props;
        const outputStyle = {};

        switch (info.status) {
            case "ACCEPTED":
                return {
                    color: theme.palette.requestResponse.accepted,
                    ...style
                };
            case "PENDING":
                return {
                    color: theme.palette.requestResponse.pending,
                    ...theme.styles.requestResponse.pending,
                    ...style
                };
            case "REJECTED":
                return {
                    color: theme.palette.requestResponse.rejected,
                    ...theme.styles.requestResponse.rejected,
                    ...style
                };
            case "REVOKED":
            case "EXPIRED":
                return {
                    color: theme.palette.requestResponse.revoked,
                    ...style
                };
        }

        // return default style
        return {
            ...outputStyle,
            ...style
        };
    };

    checkRequestInquiry = () => {
        const { theme, style, info } = this.props;
        const outputStyle = {};

        switch (info.status) {
            case "ACCEPTED":
                return {
                    color: theme.palette.requestInquiry.accepted,
                    ...style
                };
            case "PENDING":
                return {
                    color: theme.palette.requestInquiry.pending,
                    ...style
                };
            case "REJECTED":
                return {
                    color: theme.palette.requestInquiry.rejected,
                    ...theme.styles.requestInquiry.rejected,
                    ...style
                };
            case "REVOKED":
            case "EXPIRED":
                return {
                    color: theme.palette.requestInquiry.revoked,
                    ...theme.styles.requestInquiry.revoked,
                    ...style
                };

            case "EXPIRED":
                return {
                    color: theme.palette.requestInquiry.expired,
                    ...theme.styles.requestInquiry.expired,
                    ...style
                };
        }

        // return default style
        return {
            ...outputStyle,
            ...style
        };
    };

    checkPayment = () => {
        const { theme, style, info } = this.props;

        const isNegative = info.amount.value < 0;

        // switch between incoming/outgoing colors
        const paymentColor = isNegative
            ? theme.palette.common.sentPayment
            : theme.palette.common.receivedPayment;

        return {
            style: { color: paymentColor, ...style },
            isNegative: isNegative
        };
    };

    checkMasterCardAction = () => {
        const { theme, style, info } = this.props;

        switch (info.authorisation_status) {
            case "AUTHORISED":
                return {
                    style: {
                        color: theme.palette.masterCardAction.authorized,
                        ...style
                    },
                    isNegative: true
                };
            case "BLOCKED":
                return {
                    style: {
                        color: theme.palette.masterCardAction.blocked,
                        ...theme.styles.masterCardAction.blocked,
                        ...style
                    }
                };
            case "CLEARING_REFUND":
                return {
                    style: {
                        color: theme.palette.masterCardAction.refunded,
                        ...theme.styles.masterCardAction.refunded,
                        ...style
                    }
                };
            default:
            case "PENDING":
                return {
                    style: {
                        color: theme.palette.masterCardAction.pending,
                        ...style
                    }
                };
        }
    };

    render() {
        let finalStyle = {};
        let finalClassname = "";
        switch (this.props.type) {
            case "requestResponse":
                finalStyle = this.checkRequestResponse();
                break;
            case "requestInquiry":
                finalStyle = this.checkRequestInquiry();
                break;
            case "payment":
                const paymentSettings = this.checkPayment();

                finalClassname = paymentSettings.isNegative
                    ? "minus-character-content"
                    : "";
                finalStyle = paymentSettings.style;
                break;
            case "masterCardAction":
                const masterCardSettings = this.checkMasterCardAction();

                finalClassname = masterCardSettings.isNegative
                    ? "minus-character-content"
                    : "";
                finalStyle = masterCardSettings.style;
                break;
        }

        const Component = this.props.component;

        return (
            <Component className={finalClassname} style={finalStyle}>
                {this.props.children}
            </Component>
        );
    }
}

MoneyAmountLabel.defaultProps = {
    style: {},
    component: "p"
};

MoneyAmountLabel.propTypes = {
    children: PropTypes.any.isRequired,
    info: PropTypes.object.isRequired, // information about this payment/request
    type: PropTypes.string.isRequired, // requestResponse, requestInquiry etz
    component: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
    style: PropTypes.object
};

export default withTheme()(MoneyAmountLabel);
