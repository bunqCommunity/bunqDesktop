import React from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";

import { openMainDrawer } from "../Actions/main_drawer";

const styles = {
    headerBtn: {
        WebkitAppRegion: "no-drag",
        position: "fixed",
        top: 1,
        left: 5,
        zIndex: 1000
    }
};

class Header extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <header>
                <IconButton
                    aria-label="view main drawer"
                    onClick={this.props.openDrawer}
                    style={styles.headerBtn}
                >
                    <MenuIcon />
                </IconButton>
            </header>
        );
    }
}

const mapStateToProps = store => {
    return {};
};

const mapDispatchToProps = dispatch => {
    return {
        // opens the options drawer on the left
        openDrawer: () => dispatch(openMainDrawer())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
