import React from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

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
                        width: 350
                    }}
                />
            </DialogContent>
            <DialogActions>
                <CopyToClipboard
                    text={jsonPretty}
                    // onCopy={this.copiedValue(alias.type)}
                >
                    <Button variant="raised" onClick={closeModal}>
                        Copy
                    </Button>
                </CopyToClipboard>

                <Button variant="raised" onClick={closeModal} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
};
