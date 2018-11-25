import * as React from "react";
import { translate } from "react-i18next";
import IconButton from "@material-ui/core/IconButton";
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";

import FileUploadIcon from "../../Components/CustomSVG/FileUpload";

import DeleteIcon from "@material-ui/icons/Delete";
import MoreVertIcon from "@material-ui/icons/MoreVert";

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
        const t = this.props.t;
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
                <Menu id="long-menu" anchorEl={this.state.anchorEl} open={Boolean(anchorEl)} onClose={this.handleClose}>
                    <MenuItem onClick={this.openExportDialog}>
                        <ListItemIcon>
                            <FileUploadIcon />
                        </ListItemIcon>
                        <ListItemText inset primary={t("Export")} />
                    </MenuItem>
                    <Divider />

                    <MenuItem onClick={this.removeRule}>
                        <ListItemIcon>
                            <DeleteIcon />
                        </ListItemIcon>
                        <ListItemText inset primary={t("Remove")} />
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default translate("translations")(RuleItemMenu);
