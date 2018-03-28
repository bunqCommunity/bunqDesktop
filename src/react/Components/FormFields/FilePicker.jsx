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
        dialog.showOpenDialog(
            {
                defaultPath: this.props.value,
                properties: ["openFile", "promptToCreate"],
                filters: [{ name: "Settings", extensions: ["json"] }]
            },
            this.handleFileChange
        );
    };

    handleFileChange = filePaths => this.props.onChange(filePaths[0]);

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
