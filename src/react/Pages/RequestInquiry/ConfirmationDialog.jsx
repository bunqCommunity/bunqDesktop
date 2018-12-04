import React from "react";
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

export default class ConfirmationDialog extends React.Component {
    render() {
        const {
            confirmModalOpen,
            description,
            account,
            targets,
            totalSplit,
            splitAmounts,
            splitRequest,
            amount,
            t
        } = this.props;

        if (!confirmModalOpen) {
            return null;
        }

        // create a list of ListItems with our targets
        const confirmationModelTargets = targets.map(targetItem => {
            let moneyAmount = amount;

            if (splitRequest) {
                // get split amount for this target
                const splitAmountValue =
                    typeof splitAmounts[targetItem.value] === "undefined" ? 1 : splitAmounts[targetItem.value];

                // calculate percentage and then monetary amount
                const percentage = splitAmountValue / totalSplit;
                moneyAmount = amount * percentage;
            }

            // format the label
            const primaryText = `${t("Contact")}: ${targetItem.value}`;
            const secondaryText = `${t("Amount")}: ${formatMoney(moneyAmount)}`;

            return [
                <ListItem>
                    <ListItemText primary={primaryText} secondary={secondaryText} />
                </ListItem>,
                <Divider />
            ];
        });

        return (
            <Dialog open={confirmModalOpen} keepMounted onClose={this.closeModal}>
                <DialogTitle>Confirm the request</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary={t("To") + ":"}
                                secondary={`${account.description} ${account.balance.value}`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary={t("Description")}
                                secondary={description.length <= 0 ? t("None") : description}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText primary={t("Targets") + ": "} />
                        </ListItem>
                        <Divider />
                        {confirmationModelTargets}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button variant="contained" onClick={this.props.closeModal} color="secondary">
                        {t("Cancel")}
                    </Button>
                    <Button variant="contained" onClick={this.props.sendInquiry} color="primary">
                        {t("Confirm")}
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
