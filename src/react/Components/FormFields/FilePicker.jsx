import React from "react";
import Grid from "@material-ui/core/Grid";
import { translate } from "react-i18next";
import TextField from "@material-ui/core/TextField";

import ButtonTranslate from "../TranslationHelpers/Button";
import TypographyTranslate from "../TranslationHelpers/Typography";

const remote = require("electron").remote;
const dialog = remote.dialog;

class FilePicker extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    handleButtonClick = event => {
        const { value, defaultPath, properties, extensions } = this.props;
        dialog.showOpenDialog(
            {
                defaultPath: defaultPath ? defaultPath : value,
                properties: properties,
                filters: [{ name: "Allowed files", extensions: extensions }]
            },
            this.handleFileChange
        );
    };

    handleFileChange = filePaths => {
        if (filePaths && filePaths.length > 0) {
            this.props.onChange(filePaths[0]);
        }
    };

    render() {
        const { value, style, buttonContent } = this.props;

        const defaultLabel = <TypographyTranslate>Pick location</TypographyTranslate>;

        return (
            <Grid container spacing={16} style={style}>
                <Grid item xs={4}>
                    <ButtonTranslate
                        variant="contained"
                        color="primary"
                        onClick={this.handleButtonClick}
                        style={{ width: "100%" }}
                    >
                        {buttonContent ? buttonContent : defaultLabel}
                    </ButtonTranslate>
                </Grid>
                <Grid item xs={8}>
                    <TextField value={value} style={{ width: "100%" }} />
                </Grid>
            </Grid>
        );
    }
}

export default translate("translations")(FilePicker);
