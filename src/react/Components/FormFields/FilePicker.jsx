import React from "react";
import TextField from "material-ui/TextField";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";

import FileUpload from "material-ui-icons/FileUpload";

const remote = require("electron").remote;
const dialog = remote.dialog;

export default class FilePicker extends React.Component {
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

        return (
            <Grid container spacing={16} style={style}>
                <Grid item xs={4}>
                    <Button
                        variant="raised"
                        color="primary"
                        onClick={this.handleButtonClick}
                        style={{ width: "100%" }}
                    >
                        {buttonContent ? buttonContent : <FileUpload />}
                    </Button>
                </Grid>
                <Grid item xs={8}>
                    <TextField value={value} style={{ width: "100%" }} />
                </Grid>
            </Grid>
        );
    }
}
