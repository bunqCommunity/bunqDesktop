import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";

import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

import { formatMoney } from "../../Functions/Utils";

const styles = {};

class ConfirmationDialog extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const {
            t,
            confirmModalOpen,
            accounts,
            account,
            accountBalance,
            description,
            amount,
            targets,
            scheduledPaymentText
        } = this.props;

        // create a list of ListItems with our targets
        const confirmationModelTargets = targets.map(targetItem => {
            let primaryText = "";
            let secondaryText = "";

            switch (targetItem.type) {
                case "PHONE":
                    primaryText = `${t("Phone")}: ${targetItem.value}`;
                    break;
                case "EMAIL":
                    primaryText = `${t("Email")}: ${targetItem.value}`;
                    break;
                case "CONTACT":
                    primaryText = `${t("Contact")}: ${targetItem.value}`;
                    break;
                case "IBAN":
                    primaryText = `${t("IBAN")}: ${targetItem.value.replace(/ /g, "")}`;
                    secondaryText = `${t("Name")}: ${targetItem.name}`;
                    break;
                case "TRANSFER":
                    const targetAccountInfo = accounts[targetItem.value];
                    primaryText = `${t("Transfer")}: ${targetAccountInfo.description}`;
                    break;
            }

            return [
                <ListItem>
                    <ListItemText primary={primaryText} secondary={secondaryText} />
                </ListItem>,
                <Divider />
            ];
        });

        return (
            <Dialog open={confirmModalOpen} keepMounted onClose={this.props.closeModal}>
                <DialogTitle>{t("Confirm the payment")}</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem>
                            <ListItemText primary={t("From")} secondary={`${account.description} ${accountBalance}`} />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={t("Description")}
                                secondary={description.length <= 0 ? "None" : description}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={t("Amount")} secondary={formatMoney(amount)} />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={`${t("Targets")}: `} />
                        </ListItem>
                        <Divider />
                        {confirmationModelTargets}

                        {scheduledPaymentText ? scheduledPaymentText : null}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={this.props.closeModal} color="secondary">
                        {t("Cancel")}
                    </Button>
                    <Button variant="contained" onClick={this.props.sendPayment} color="primary">
                        {t("Confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts
    };
};

export default connect(mapStateToProps)(translate("translations")(ConfirmationDialog));
