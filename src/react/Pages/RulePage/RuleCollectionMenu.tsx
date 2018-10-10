import * as React from "react";
import { translate } from "react-i18next";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import FileUploadIcon from "../../Components/CustomSVG/FileUpload";

import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";

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
        const t = this.props.t;
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
                <Menu id="long-menu" anchorEl={this.state.anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                    <MenuItem onClick={this.exportData}>
                        <ListItemIcon>
                            <FileUploadIcon />
                        </ListItemIcon>
                        <ListItemText inset primary={t("Export")} />
                    </MenuItem>

                    {this.props.canBeDeleted ? <Divider /> : null}
                    {this.props.canBeDeleted ? (
                        <MenuItem onClick={this.props.deleteRuleCollection}>
                            <ListItemIcon>
                                <DeleteIcon />
                            </ListItemIcon>
                            <ListItemText inset primary={t("Delete")} />
                        </MenuItem>
                    ) : null}
                </Menu>
            </div>
        );
    }
}

export default translate("translations")(RuleCollectionMenu);
