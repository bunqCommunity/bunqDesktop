import React from "react";
import SpeedDial from "@material-ui/lab/SpeedDial";
import SpeedDialIcon from "@material-ui/lab/SpeedDialIcon";
import SpeedDialAction from "@material-ui/lab/SpeedDialAction";

import CloseIcon from "@material-ui/icons/Close";

const styles = {
    speedDial: {
        position: "absolute",
        bottom: 12,
        right: 12,
        width: 60
    }
};

class SpeedDialCustom extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            open: false
        };
    }

    handleClick = () => {
        this.setState({ open: !this.state.open });
    };

    handleOpen = () => {
        if (!this.state.hidden) {
            this.setState({
                open: true
            });
        }
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    render() {
        const { open } = this.state;
        const { hidden, actions, ariaLabel } = this.props;

        return (
            <SpeedDial
                style={{ ...styles.speedDial, ...this.props.style }}
                ariaLabel={ariaLabel}
                hidden={hidden}
                icon={<SpeedDialIcon openIcon={<CloseIcon />} />}
                onBlur={this.handleClose}
                onClick={this.handleClick}
                onClose={this.handleClose}
                onFocus={this.handleOpen}
                onMouseEnter={this.handleOpen}
                onMouseLeave={this.handleClose}
                open={open}
            >
                {actions.map(action => {
                    const Icon = action.icon;
                    let iconColor = action.color ? action.color : "action";

                    return (
                        <SpeedDialAction
                            key={action.name}
                            icon={<Icon color={iconColor} />}
                            tooltipTitle={action.name}
                            onClick={action.onClick}
                        />
                    );
                })}
            </SpeedDial>
        );
    }
}
SpeedDialCustom.defaultProps = {
    style: {},
    actions: [],
    ariaLabel: "More options",
    hidden: true
};

export default SpeedDialCustom;
