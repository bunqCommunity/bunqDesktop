import React from "react";
import PropTypes from "prop-types";
import QArt from "qartjs";

class QRCode extends React.PureComponent {
    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
        const qart = new QArt({
            value: this.props.value,
            imagePath: this.props.imagePath,
            size: this.props.size,
            filter: this.props.filter
        });
        qart.make(this.element);
    }

    render() {
        return (
            <div
                style={{ ...this.props.style, backgroundColor: "white" }}
                ref={input => {
                    this.element = input;
                }}
            />
        );
    }
}

QRCode.defaultProps = {
    filter: "color",
    size: 192,
    style: {}
};

QRCode.propTypes = {
    value: PropTypes.string.isRequired,
    imagePath: PropTypes.string.isRequired,
    filter: PropTypes.string,
    size: PropTypes.number,
    style: PropTypes.object
};

export default QRCode;
