import React from "react";
import Helmet from "react-helmet";
import Typography from "material-ui/Typography";

class NotFound extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <Helmet>
                    <title>{`BunqDesktop - 404 Not Found`}</title>
                </Helmet>
                <Typography type="title">Page Not Found</Typography>
            </div>
        );
    }
}

export default NotFound;
