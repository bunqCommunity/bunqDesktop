import React from "react";
import { connect } from "react-redux";
import Grid from "material-ui/Grid";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle
} from "material-ui/Dialog";

const styles = {};

class ScheduledPaymentsEdit extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const t = this.props.t;

        return (
            <Dialog
                open={this.state.openSettingsDialog}
                onClose={this.toggleSettingsDialog}
            >
                <DialogTitle>{t("Edit scheduled payment")}</DialogTitle>

                <DialogContent>
                    <TextField
                        style={styles.textField}
                        value={this.state.settingsDescription}
                        onChange={this.handleDescriptionChange}
                        error={
                            this.state.settingsDescription.length === 0
                        }
                        placeholder={t("Account description")}
                    />
                    <TextField
                        style={styles.textField}
                        value={this.state.settingsDailyLimit}
                        onChange={this.handleDailyLimitChange}
                        type={"number"}
                        placeholder={t("Daily limit")}
                        inputProps={{
                            min: 0,
                            max: 10000
                        }}
                    />
                </DialogContent>

                <DialogActions>
                    <ButtonTranslate
                        variant="raised"
                        onClick={this.toggleSettingsDialog}
                        color="secondary"
                        autoFocus
                    >
                        Cancel
                    </ButtonTranslate>
                    <ButtonTranslate
                        variant="raised"
                        onClick={this.editAccount}
                        disabled={
                            this.props.accountsLoading ||
                            this.state.settingsDescription.length === 0
                        }
                        color="primary"
                    >
                        Update
                    </ButtonTranslate>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {};
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(
    ScheduledPaymentsEdit
);
