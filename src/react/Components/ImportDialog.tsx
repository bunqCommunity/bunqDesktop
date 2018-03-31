import * as React from "react";
import { translate } from "react-i18next";
import Button from "material-ui/Button";
import TextField from "material-ui/TextField";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from "material-ui/Dialog";
import Slide from "material-ui/transitions/Slide";

import TranslateButton from "./TranslationHelpers/Button";

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
        this.setState(
            { importContent: event.target.value },
            this.validateImportData
        );
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
        let { open, closeModal, title, showAsNewButton, t } = this.props;
        if (!showAsNewButton) showAsNewButton = false;

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
                    <TranslateButton
                        variant="raised"
                        onClick={closeModal}
                        color="secondary"
                    >
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

export default translate("translations")(ImportDialog);
