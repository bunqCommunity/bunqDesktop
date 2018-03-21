import React from "react";
import Button from "material-ui/Button";
import List, { ListItem, ListItemText } from "material-ui/List";
import Dialog, {
    DialogActions,
    DialogContent,
    DialogTitle
} from "material-ui/Dialog";
import { formatMoney } from "../../Helpers/Utils";

export default class ConfirmationDialog extends React.Component {
    render() {
        const {
            confirmModalOpen,
            description,
            amount
        } = this.props;

        if (!confirmModalOpen) {
            return null;
        }

        return (
            <Dialog
                open={confirmModalOpen}
                keepMounted
                onClose={this.props.closeModal}
            >
                <DialogTitle>Confirm the request</DialogTitle>
                <DialogContent>
                    <List>
                        <ListItem>
                            <ListItemText
                                primary="Description"
                                secondary={description}
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Amount"
                                secondary={formatMoney(amount)}
                            />
                        </ListItem>
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="raised"
                        onClick={this.props.closeModal}
                        color="secondary"
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="raised"
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
