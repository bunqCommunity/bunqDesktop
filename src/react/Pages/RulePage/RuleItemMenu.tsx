import * as React from "react";
import IconButton from "material-ui/IconButton";
import Menu, { MenuItem } from "material-ui/Menu";
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
                    <MenuItem onClick={this.props.removeRule} color="secondary">Remove</MenuItem>
                </Menu>
            </div>
        );
    }
}

export default RuleItemMenu;
