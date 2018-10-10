import React from "react";
import Helmet from "react-helmet";
import { translate } from "react-i18next";
import Typography from "@material-ui/core/Typography";

import TypographyTranslate from "../Components/TranslationHelpers/Typography";

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
                <TypographyTranslate variant="title">Page Not Found</TypographyTranslate>
            </div>
        );
    }
}

export default translate("translations")(NotFound);
