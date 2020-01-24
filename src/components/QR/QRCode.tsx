import React from "react";
import QRCodeReact from "qrcode.react";

const styles = {
    clickable: {
        pointer: "cursor"
    }
};

interface IState {
    [key: string]: any;
}

interface IProps {
    [key: string]: any;
}

class QRCode extends React.PureComponent<IProps> {
    static defaultProps = {
        size: 195,
        style: {}
    };

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
            />
        );
    }
}

export default QRCode;
