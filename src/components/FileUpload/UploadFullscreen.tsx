import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Dialog from "@material-ui/core/Dialog";
import Typography from "@material-ui/core/Typography";
import Slide from "@material-ui/core/Slide";
import TranslateButton from "~components/TranslationHelpers/Button";
import { AppDispatch, ReduxState } from "~store/index";

import FilePicker from "./FilePicker";

import { actions as snackbarActions } from "~store/snackbar";

declare let window: any;

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

interface IState {
    [key: string]: any;
}

interface IProps {
    [key: string]: any;
}

class UploadFullscreen extends React.Component<ReturnType<typeof mapStateToProps> & ReturnType<typeof mapDispatchToProps> & IProps> {
    static defaultProps = {
        headlineText: "Upload a new avatar",
        buttonText: "Upload"
    };

    state: IState;

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
        const BunqJSClient = window.BunqDesktopClient.BunqJSClient;
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
            const fileBuffer = Buffer.from(fileArrayBuffer as any);

            BunqJSClient.api.attachmentPublic
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
                        <Typography /* type={"headline"} */ style={styles.header as CSSProperties}>
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

const mapStateToProps = (state: ReduxState) => {
    return {};
};

const mapDispatchToProps = (dispatch: AppDispatch) => {
    return {
        openSnackbar: message => dispatch(snackbarActions.open({ message }))
    };
};

export default translate("translations")(connect(mapStateToProps, mapDispatchToProps)(UploadFullscreen));
