import React from "react";
import PropTypes from "prop-types";
import { withTheme } from "material-ui/styles";

class MoneyAmountLabel extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (nextProps.theme.themeName !== this.props.theme.themeName)
            return true;
        if (nextProps.children !== this.props.children) return true;
        if (nextProps.type !== this.props.type) return true;

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

    checkPayment = () => {
        return {};
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
                return {
                    color: theme.palette.requestInquiry.revoked,
                    ...theme.styles.requestInquiry.revoked,
                    ...style
                };
        }

        // return default style
        return {
            ...outputStyle,
            ...style
        };
    };

    render() {
        const { type, info, component: Component } = this.props;

        let finalStyle = {};
        switch (type) {
            case "requestResponse":
                finalStyle = this.checkRequestResponse();
                break;
            case "requestInquiry":
                finalStyle = this.checkRequestInquiry();
                break;
            case "payment":
                finalStyle = this.checkPayment();
                break;
        }

        return <p style={finalStyle}>{this.props.children}</p>;
    }
}

MoneyAmountLabel.defaultProps = {
    style: {}
};

MoneyAmountLabel.propTypes = {
    children: PropTypes.any.isRequired,
    info: PropTypes.object.isRequired, // information about this payment/request
    type: PropTypes.string.isRequired, // requestResponse, requestInquiry etz
    style: PropTypes.object
};

export default withTheme()(MoneyAmountLabel);
