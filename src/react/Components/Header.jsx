import React from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import MenuIcon from "material-ui-icons/Menu";
import Hidden from "material-ui/Hidden";

import { openMainDrawer } from "../Actions/main_drawer";

const styles = {
    headerBtn: {
        color: "white",
        WebkitAppRegion: "no-drag",
        position: "fixed",
        top: 1,
        left: 5,
        zIndex: 1000
    },
    header: {
        // background: "url(images/bunq-colours-bar-2.png)",
        WebkitAppRegion: "drag",
        WebkitUserSelect: "none",
        position: "fixed",
        width: "100%",
        top: 0,
        zIndex: 10000,
        height: 50,
        zIndex: 1000,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center"
    }
};

class Header extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const menuButton = (
            <IconButton
                aria-label="view main drawer"
                onClick={this.props.openDrawer}
                style={styles.headerBtn}
            >
                <MenuIcon />
            </IconButton>
        );

        if (this.props.stickyMenu) {
            return (
                <header style={styles.header} className={"rainbow-background"}>
                    <Hidden mdUp>{menuButton}</Hidden>
                </header>
            );
        }
        return (
            <header style={styles.header} className={"rainbow-background"}>
                {menuButton}
            </header>
        );
    }
}

const mapStateToProps = store => {
    return {
        stickyMenu: store.options.sticky_menu
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // opens the options drawer on the left
        openDrawer: () => dispatch(openMainDrawer())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Header);
