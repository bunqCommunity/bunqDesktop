import React from "react";
import QRCodeReact from "qrcode.react";
import PropTypes from "prop-types";

class QRCode extends React.PureComponent {
    render() {
        const { size, value, style } = this.props;
        return <QRCodeReact size={size} value={value} style={style} />;
    }
}

QRCode.defaultProps = {
    size: 195,
    style: {}
};

QRCode.propTypes = {
    value: PropTypes.string.isRequired,
    size: PropTypes.number,
    style: PropTypes.object
};

export default QRCode;
