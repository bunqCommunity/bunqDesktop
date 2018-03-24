import * as React from "react";
import IconButton from "material-ui/IconButton";
import Divider from "material-ui/Divider";
import Menu, { MenuItem } from "material-ui/Menu";
import { ListItemIcon, ListItemText } from "material-ui/List";

import FileUploadIcon from "material-ui-icons/FileUpload";
import DeleteIcon from "material-ui-icons/Delete";
import MoreVertIcon from "material-ui-icons/MoreVert";

class RuleItemMenu extends React.Component<any, any> {
    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    removeRule = event => {
        this.props.removeRule();
        this.handleClose();
    };
    openExportDialog = event => {
        this.props.openExportDialog(this.props.rule);
        this.handleClose();
    };

    render() {
        const { anchorEl } = this.state;

        return (
            <div>
                <IconButton
                    aria-label="More"
                    aria-owns={anchorEl ? "long-menu" : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    id="long-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.openExportDialog}>
                        <ListItemIcon>
                            <FileUploadIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Export" />
                    </MenuItem>
                    <Divider />

                    <MenuItem onClick={this.removeRule}>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Remove" />
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default RuleItemMenu;
