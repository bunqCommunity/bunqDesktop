import React from "react";
import Helmet from "react-helmet";

class NotFound extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <Helmet>
                    <title>{`BunqWeb - 404 Not Found`}</title>
                </Helmet>
                <h1>Page Not Found</h1>
            </div>
        );
    }
}

export default NotFound;
