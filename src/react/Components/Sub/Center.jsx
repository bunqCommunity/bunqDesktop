import React from "react";

const styles = {
    flexContainerStyle: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }
};

class Center extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div {...this.props} style={styles.flexContainerStyle}>
                {this.props.children}
            </div>
        );
    }
}

export default Center;
