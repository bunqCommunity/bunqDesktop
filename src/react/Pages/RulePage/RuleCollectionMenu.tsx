import * as React from "react";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import Menu, { MenuItem } from "material-ui/Menu";
import { ListItemIcon, ListItemText } from "material-ui/List";

import MoreVertIcon from "material-ui-icons/MoreVert";
import DeleteIcon from "material-ui-icons/Delete";
import FileUploadIcon from "material-ui-icons/FileUpload";

class RuleCollectionMenu extends React.Component<any, any> {
    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    exportData = event => {
        this.props.openExportDialog();
        this.handleClose();
    };

    render() {
        const { anchorEl } = this.state;

        return (
            <div>
                <IconButton
                    aria-label="Rule collection settings"
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
                    <MenuItem onClick={this.exportData}>
                        <ListItemIcon>
                            <FileUploadIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Export" />
                    </MenuItem>

                    <Divider />

                    <MenuItem>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText inset primary="Delete" />
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default RuleCollectionMenu;
