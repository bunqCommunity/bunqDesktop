import React from "react";
import Button from "material-ui/Button";
import List, { ListItem, ListItemText } from "material-ui/List";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from "material-ui/Dialog";

export default class ConfirmationDialog extends React.Component {
    render() {
        const {
            confirmModalOpen,
            account,
            targetType,
            description,
            ibanName,
            amount,
            target
        } = this.props;

        if (!confirmModalOpen) {
            return null;
        }

        return (
            <Dialog
                open={confirmModalOpen}
                keepMounted
                onRequestClose={this.props.closeModal}
            >
                <DialogTitle>Confirm the request</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="To"
                                secondary={`${account.description} ${account
                                    .balance.value} ${account.balance
                                    .currency}`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Description"
                                secondary={description}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Amount"
                                secondary={`${amount.toFixed(2)} ${account
                                    .balance.currency}`}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="To"
                                secondary={(() => {
                                    switch (targetType) {
                                        case "PHONE":
                                            return `Phone: ${target}`;
                                        case "EMAIL":
                                            return `Email: ${target}`;
                                    }
                                })()}
                            />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        raised
                        onClick={this.props.closeModal}
                        color="accent"
                    >
                        Cancel
                    </Button>
                    <Button
                        raised
                        onClick={this.props.sendInquiry}
                        color="primary"
                    >
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}
