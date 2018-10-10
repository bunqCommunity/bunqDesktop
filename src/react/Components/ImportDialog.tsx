import * as React from "react";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";
import Slide from "@material-ui/core/Slide";

import TranslateButton2 from "./TranslationHelpers/Button";
const TranslateButton: any = TranslateButton2;

const Transition = props => <Slide direction="left" {...props} />;

class ImportDialog extends React.Component<any, any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.state = {
            importContent: "",
            importContentError: false
        };
    }

    importContentChange = event => {
        this.setState({ importContent: event.target.value }, this.validateImportData);
    };

    importData = (asNew: boolean = false) => {
        if (!this.state.importContentError) {
            const data = JSON.parse(this.state.importContent);

            // if imported as new item, reset ID
            if (asNew) {
                data.id = null;
            }

            this.props.importData(data);
            this.props.closeModal();
        }
    };
    importDataNew = event => this.importData(true);
    importDataOverwrite = event => this.importData(false);

    validateImportData = () => {
        let jsonIsInvalid = false;
        try {
            JSON.parse(this.state.importContent);
        } catch (ex) {
            jsonIsInvalid = true;
        }
        this.setState({
            importContentError: jsonIsInvalid
        });
    };

    render() {
        let { open, closeModal, title, showAsNewButton } = this.props;
        if (!showAsNewButton) showAsNewButton = false;

        return (
            <Dialog TransitionComponent={Transition} keepMounted open={open} onClose={closeModal}>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <TextField
                        onChange={this.importContentChange}
                        value={this.state.importContent}
                        error={this.state.importContentError}
                        multiline
                        rows="8"
                        style={{
                            width: 450
                        }}
                    />
                </DialogContent>
                <DialogActions>
                    <TranslateButton variant="raised" onClick={closeModal} color="secondary">
                        Cancel
                    </TranslateButton>

                    {showAsNewButton ? (
                        <TranslateButton variant="raised" onClick={this.importDataNew}>
                            Import as new
                        </TranslateButton>
                    ) : null}

                    <TranslateButton
                        variant="raised"
                        onClick={this.importDataOverwrite}
                        disabled={this.state.importContentError}
                        color="primary"
                    >
                        Import
                    </TranslateButton>
                </DialogActions>
            </Dialog>
        );
    }
}

export default ImportDialog;
