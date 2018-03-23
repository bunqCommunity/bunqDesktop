import React from "react";
import { connect } from "react-redux";
import IconButton from "material-ui/IconButton";
import Hidden from "material-ui/Hidden";

import MenuIcon from "material-ui-icons/Menu";
import CloseIcon from "material-ui-icons/Close";

import { openMainDrawer } from "../Actions/main_drawer";

const buttonDefaultStyles = {
    color: "white",
    WebkitAppRegion: "no-drag",
    position: "fixed",
    top: 1,
    zIndex: 1000
};

const styles = {
    headerMenuBtn: {
        ...buttonDefaultStyles,
        left: 5
    },
    headerRightBtn: {
        ...buttonDefaultStyles,
        right: 5
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

    closeApp() {
        window.close();
    }

    render() {
        const menuButton = (
            <IconButton
                aria-label="view main drawer"
                onClick={this.props.openDrawer}
                style={styles.headerMenuBtn}
            >
                <MenuIcon />
            </IconButton>
        );
        const wrappedButton = this.props.stickyMenu ? (
            <Hidden mdUp>{menuButton}</Hidden>
        ) : (
            menuButton
        );

        return (
            <header style={styles.header} className={"rainbow-background"}>
                {wrappedButton}
                <IconButton
                    aria-label="Exit application"
                    onClick={this.closeApp}
                    style={styles.headerRightBtn}
                >
                    <CloseIcon />
                </IconButton>
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
