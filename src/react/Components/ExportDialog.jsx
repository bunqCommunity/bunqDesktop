import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

import TranslateButton from "./TranslationHelpers/Button";
import ReactJsonWrapper from "./ReactJsonWrapper";

const Transition = props => <Slide direction="right" {...props} />;

const styles = {
    textField: {
        width: 480
    }
};

export default props => {
    const { open, closeModal, title, object } = props;
    const jsonPretty = JSON.stringify(object, null, "\t");

    return (
        <Dialog
            TransitionComponent={Transition}
            keepMounted
            open={open}
            onClose={closeModal}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {object ? (
                    <ReactJsonWrapper
                        style={styles.textField}
                        data={object}
                        name="Export Data"
                    />
                ) : null}
            </DialogContent>
            <DialogActions>
                <CopyToClipboard text={jsonPretty}>
                    <TranslateButton variant="raised" onClick={closeModal}>
                        Copy
                    </TranslateButton>
                </CopyToClipboard>

                <TranslateButton
                    variant="raised"
                    onClick={closeModal}
                    color="primary"
                >
                    Ok
                </TranslateButton>
            </DialogActions>
        </Dialog>
    );
};
