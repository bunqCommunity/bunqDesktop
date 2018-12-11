import React from "react";
import { translate } from "react-i18next";
import { withStyles } from "@material-ui/core/styles";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import FileDropZone from "./FileDropZone";

import FileReaderHelper from "@bunq-community/bunq-js-client/dist/Helpers/FileReaderHelper";

const Transition = props => <Slide direction={"up"} {...props} />;

const contentSize = 320;

const styles = theme => ({
    dialog: {
        marginTop: 50
    },
    header: {
        textAlign: "center"
    },
    content: {
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    contentWrapper: {
        width: contentSize,
        minHeight: contentSize
    },
    uploadButton: {
        width: "100%"
    }
});

class UploadFullscreen extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            file: false
        };
    }

    onFileChange = file => this.setState({ file });

    getFileInfo = async () => {
        console.log("start");
        const fileReader = new FileReader();

        console.log("readAsArrayBuffer");
        // start loading the file as binary
        fileReader.readAsArrayBuffer(this.state.file);

        console.log("wait");
        // wrap the filereader callback in a promise
        const fileArrayBuffer = await new Promise(resolve => {
            console.log("waiting");
            // resolve the output onload
            fileReader.onload = () => {
                console.log("loaded");
                console.log(this.state.file);
                console.log(fileReader);

                resolve(fileReader.result);
            };
        });

        console.log("from arraybuffer");
        const fileBuffer = Buffer.from(fileArrayBuffer);

        return {
            contents: fileBuffer
        };
    };

    startUpload = () => {
        console.log("dang");
        this.getFileInfo()
            .then(result => {
                console.log("result", result);
            })
            .catch(console.error);

        // this.props.BunqJSClient.api.attachmentPublic
        //     .post(this.state.file)
        //     .then(console.log)
        //     .catch(console.error);
    };

    render() {
        const { classes, t } = this.props;
        return (
            <Dialog
                fullScreen
                className={classes.dialog}
                open={this.props.open}
                onClick={this.props.handleRequestClose}
                onClose={close => {
                    console.log("close", close);
                    this.props.handleRequestClose(close);
                }}
                TransitionComponent={Transition}
            >
                <div className={classes.content}>
                    <div className={classes.contentWrapper}>
                        <Typography type={"headline"} className={classes.header}>
                            {t(this.props.headlineText)}
                        </Typography>
                        <FileDropZone onChange={this.onFileChange} />
                        <br />
                        {this.state.file !== false ? (
                            <Button
                                color="primary"
                                variant="contained"
                                className={classes.uploadButton}
                                onClick={this.startUpload}
                            >
                                {t(this.props.buttonText)}
                            </Button>
                        ) : null}
                    </div>
                </div>
            </Dialog>
        );
    }
}

UploadFullscreen.defaultProps = {
    headlineText: "Upload a new avatar",
    buttonText: "Upload"
};

export default withStyles(styles)(translate("translations")(UploadFullscreen));
