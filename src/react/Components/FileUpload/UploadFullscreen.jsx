import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import TranslateButton from "../../Components/TranslationHelpers/Button";

import FilePicker from "./FilePicker";

import { openSnackbar } from "../../Actions/snackbar";

const Transition = props => <Slide direction={"up"} {...props} />;

const contentSize = 320;

const styles = {
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
    closeButton: {
        position: "fixed",
        top: 20,
        left: 20
    },
    uploadButton: {
        width: "100%"
    }
};

class UploadFullscreen extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            file: false,
            uploadingFile: false
        };
    }

    handleFileDrop = file => {
        this.setState({ file });
        window.file = file;
    };

    startUpload = () => {
        const file = this.state.file;

        // close the fullscreen page on upload
        this.props.onClose();

        this.setState({
            uploadingFile: true
        });

        // start loading the file as array buffer
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(file);

        // wrap the filereader callback in a promise
        new Promise(resolve => {
            // resolve the output onload
            fileReader.onload = () => resolve(fileReader.result);
        }).then(fileArrayBuffer => {
            // transform array buffer into regular buffer
            const fileBuffer = Buffer.from(fileArrayBuffer);

            this.props.BunqJSClient.api.attachmentPublic
                .post(fileBuffer, file.type)
                .then(response => {
                    this.props.onComplete(response);
                    this.setState({
                        uploadingFile: false
                    });
                })
                .catch(error => {
                    this.props.openSnackbar(this.props.t("Failed to upload image"));
                    this.setState({
                        uploadingFile: false
                    });
                });
        });
    };

    render() {
        const { t } = this.props;

        t("Failed to upload image");

        return (
            <Dialog
                fullScreen
                style={styles.dialog}
                open={this.props.open}
                onClose={this.props.onClose}
                TransitionComponent={Transition}
            >
                <TranslateButton
                    style={styles.closeButton}
                    onClick={this.props.onClose}
                    color="primary"
                    variant="contained"
                >
                    Close
                </TranslateButton>
                <div style={styles.content}>
                    <div style={styles.contentWrapper}>
                        <Typography type={"headline"} style={styles.header}>
                            {t(this.props.headlineText)}
                        </Typography>
                        <FilePicker handleFileDrop={this.handleFileDrop} />
                        {this.state.file && (
                            <TranslateButton
                                variant="contained"
                                color="primary"
                                style={styles.uploadButton}
                                onClick={this.startUpload}
                                disabled={this.state.uploadingFile}
                            >
                                Upload
                            </TranslateButton>
                        )}
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

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        openSnackbar: message => dispatch(openSnackbar(message))
    };
};

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(UploadFullscreen));
