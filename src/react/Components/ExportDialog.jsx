import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import TextField from "material-ui/TextField";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

import TranslateButton from "./TranslationHelpers/Button";

const Transition = props => <Slide direction="right" {...props} />;

export default props => {
    const { open, closeModal, title, object } = props;
    const jsonPretty = JSON.stringify(object, null, "\t");

    return (
        <Dialog
            transition={Transition}
            keepMounted
            open={open}
            onClose={closeModal}
        >
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <TextField
                    value={jsonPretty}
                    onChange={() => {}}
                    multiline
                    rows="8"
                    style={{
                        width: 450
                    }}
                />
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
