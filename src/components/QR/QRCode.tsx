import React from "react";
import QRCodeReact from "qrcode.react";
import PropTypes from "prop-types";

const styles = {
    clickable: {
        pointer: "cursor"
    }
};

class QRCode extends React.PureComponent {
    render() {
        const { size, value, style, onClick, ...otherProps } = this.props;

        let qrOnClick = () => {};
        if (onClick) {
            qrOnClick = onClick;
        }

        return (
            <QRCodeReact
                size={size}
                value={value}
                style={style}
                onClick={qrOnClick}
                style={onClick && styles.clickable}
            />
        );
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
