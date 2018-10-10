import React from "react";
import { translate } from "react-i18next";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Dialog from "@material-ui/core/Dialog";

import { formatMoney } from "../../Helpers/Utils";

import ButtonTranslate from "../../Components/TranslationHelpers/Button";

class ConfirmationDialog extends React.Component {
    render() {
        const { confirmModalOpen, description, amount, t } = this.props;

        if (!confirmModalOpen) {
            return null;
        }

        return (
            <Dialog open={confirmModalOpen} keepMounted onClose={this.props.closeModal}>
                <DialogTitle>{t("Confirm the request")}</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem>
                            <ListItemText primary={t("Description")} secondary={description} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={t("Amount")} secondary={formatMoney(amount)} />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <ButtonTranslate variant="raised" onClick={this.props.closeModal} color="secondary">
                        Cancel
                    </ButtonTranslate>
                    <ButtonTranslate variant="raised" onClick={this.props.sendInquiry} color="primary">
                        Confirm
                    </ButtonTranslate>
                </DialogActions>
            </Dialog>
        );
    }
}

export default translate("translations")(ConfirmationDialog);
