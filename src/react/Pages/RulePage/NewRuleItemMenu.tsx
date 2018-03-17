import * as React from "react";
import Button from "material-ui/IconButton";
import Menu, { MenuItem } from "material-ui/Menu";
import { RuleTypes } from "./Types/Types";

class NewRuleItemMenu extends React.Component<any, any> {
    state = {
        anchorEl: null
    };

    handleClick = event => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleClose = () => {
        this.setState({ anchorEl: null });
    };

    addRule = (ruleType: RuleTypes) => event => {
        this.props.addRule(ruleType);
        this.handleClose();
    };

    render() {
        const { anchorEl } = this.state;

        return (
            <div>
                <Button
                    aria-label="More"
                    aria-owns={anchorEl ? "long-menu" : null}
                    aria-haspopup="true"
                    onClick={this.handleClick}
                >
                    New
                </Button>
                <Menu
                    id="long-menu"
                    anchorEl={this.state.anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={this.handleClose}
                >
                    <MenuItem onClick={this.addRule("VALUE")}>
                        Value check
                    </MenuItem>
                    <MenuItem onClick={this.addRule("TRANSACTION_AMOUNT")}>
                        Transaction amount
                    </MenuItem>
                    <MenuItem onClick={this.addRule("ITEM_TYPE")}>
                        Event type
                    </MenuItem>
                </Menu>
            </div>
        );
    }
}

export default NewRuleItemMenu;
