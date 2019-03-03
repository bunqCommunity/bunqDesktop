import React from "react";
import Helmet from "react-helmet";
import { translate } from "react-i18next";

import TranslateTypography from "../Components/TranslationHelpers/Typography";

class NotFound extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <div style={{ textAlign: "center", marginTop: 40 }}>
                <Helmet>
                    <title>{`bunqDesktop - 404 ${this.props.t("Not Found")}`}</title>
                </Helmet>
                <TranslateTypography variant="h6">Page Not Found</TranslateTypography>
            </div>
        );
    }
}

export default translate("translations")(NotFound);
