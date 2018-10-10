import React from "react";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Hidden from "@material-ui/core/Hidden";

import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import RestoreIcon from "./CustomSVG/Restore";
import MaximizeIcon from "./CustomSVG/Maximize";
import MinimizeIcon from "./CustomSVG/Minimize";

import QueueHeaderIcon from "./Queue/QueueHeaderIcon";
import TranslateTypography from "./TranslationHelpers/Typography";

import IsDarwin from "../Helpers/IsDarwin";
import { openSidebar } from "../Actions/sidebar";

const remote = require("electron").remote;

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
    headerMenuBtnDarwin: {
        ...buttonDefaultStyles,
        right: 5
    },
    headerQueueBtn: {
        ...buttonDefaultStyles,
        left: 52
    },
    headerQueueBtnDarwin: {
        ...buttonDefaultStyles,
        right: 52
    },

    headerRightBtn: {
        ...buttonDefaultStyles,
        right: 5
    },
    headerRightBtn2: {
        ...buttonDefaultStyles,
        right: 45
    },
    headerRightBtn3: {
        ...buttonDefaultStyles,
        right: 85
    },

    header: {
        backgroundImage: "url('images/svg/bunq_Colors.svg')",
        WebkitAppRegion: "drag",
        WebkitUserSelect: "none",
        position: "fixed",
        width: "100%",
        top: 0,
        height: 50,
        zIndex: 2000,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center center"
    }
};

class Header extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            forceUpdate: null
        };

        this.mainWindow = remote.getCurrentWindow();
        window.onresize = () => this.setState({ forceUpdate: new Date() });
    }

    closeApp = () => this.mainWindow.close();

    minimizeApp = () => this.mainWindow.minimize();

    maximizeRestoreApp = () => {
        if (this.mainWindow.isMaximized()) {
            this.mainWindow.unmaximize();
        } else if (!this.mainWindow.isMinimized()) {
            this.mainWindow.maximize();
        }
        this.setState({ forceUpdate: new Date() });
    };

    render() {
        const pdfSaveModeEnabled = this.props.pdfSaveModeEnabled;

        // only show buttons on windows/linux and when native frame is disabled
        const displayButtons = !IsDarwin() && this.props.nativeFrame === false;

        // if not on macOS or native frame is used we display the icons on the left
        const menuIconButtonStyle =
            !IsDarwin() || this.props.nativeFrame === true ? styles.headerMenuBtn : styles.headerMenuBtnDarwin;
        const queueIconButtonStyle =
            !IsDarwin() || this.props.nativeFrame === true ? styles.headerQueueBtn : styles.headerQueueBtnDarwin;

        // the top header buttons
        const menuButton = (
            <IconButton aria-label="view main drawer" onClick={this.props.openDrawer} style={menuIconButtonStyle}>
                <MenuIcon />
            </IconButton>
        );
        const queueIconButton = <QueueHeaderIcon style={queueIconButtonStyle} />;

        // wrap in a hidden wrapper in case of sticky menu mode
        const wrappedButton = this.props.stickyMenu ? <Hidden mdUp>{menuButton}</Hidden> : menuButton;
        const wrappedQueueIcon = this.props.stickyMenu ? <Hidden mdUp>{queueIconButton}</Hidden> : queueIconButton;

        // wrap it in a hidden wrapper in case of sticky menu mode

        let middleIcon = null;
        if (this.mainWindow.isMaximized()) {
            middleIcon = <RestoreIcon />;
        } else if (!this.mainWindow.isMinimized()) {
            middleIcon = <MaximizeIcon />;
        }
        const windowControls = displayButtons ? (
            <React.Fragment>
                <IconButton aria-label="Minimize application" onClick={this.minimizeApp} style={styles.headerRightBtn3}>
                    <MinimizeIcon />
                </IconButton>
                <IconButton
                    aria-label="Maximize or restore application"
                    onClick={this.maximizeRestoreApp}
                    style={styles.headerRightBtn2}
                >
                    {middleIcon}
                </IconButton>
                <IconButton aria-label="Exit application" onClick={this.closeApp} style={styles.headerRightBtn}>
                    <CloseIcon />
                </IconButton>
            </React.Fragment>
        ) : null;

        const developmentEnvWarning =
            this.props.environment === "SANDBOX" ? (
                <TranslateTypography
                    style={{
                        marginLeft: 53,
                        lineHeight: `${styles.header.height}px`,
                        fontSize: "11pt",
                        textAlign: "center"
                    }}
                >
                    Sandbox mode active
                </TranslateTypography>
            ) : null;

        return (
            <header style={styles.header}>
                {/* hide all buttons if pdf mode enabled */}
                {!pdfSaveModeEnabled && (
                    <React.Fragment>
                        {wrappedButton}
                        {wrappedQueueIcon}

                        {developmentEnvWarning}
                        {windowControls}
                    </React.Fragment>
                )}
            </header>
        );
    }
}

const mapStateToProps = state => {
    return {
        stickyMenu: state.options.sticky_menu,
        nativeFrame: state.options.native_frame,
        minimizeToTray: state.options.minimize_to_tray,

        pdfSaveModeEnabled: state.application.pdf_save_mode_enabled,

        environment: state.registration.environment
    };
};

const mapDispatchToProps = dispatch => {
    return {
        // opens the options drawer on the left
        openDrawer: () => dispatch(openSidebar())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
