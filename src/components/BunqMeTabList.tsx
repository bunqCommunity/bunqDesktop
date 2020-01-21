import React from "react";
import { connect } from "react-redux";
import Link from "react-router-dom/Link";
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import LinearProgress from "@material-ui/core/LinearProgress";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";

import Visible from "@material-ui/icons/Visibility";
import VisibleOff from "@material-ui/icons/VisibilityOff";
import UrlIcon from "@material-ui/icons/Link";

import BunqMeTabListItem from "./ListItems/BunqMeTabListItem";

import { actions as snackbarActions } from "~store/snackbar";
import { bunqMeTabPut } from "~store/bunqMeTab/thunks";

const styles: any = {
    list: {
        textAlign: "left"
    },
    chip: {
        cursor: "pointer",
        marginRight: 8
    }
};

class BunqMeTabList extends React.Component<any> {
    static defaultProps = {
        secondaryActions: null
    };

    state: any;

    constructor(props, context) {
        super(props, context);
        this.state = {
            showInactiveTabs: false
        };
    }

    copiedValue = type => callback => {
        this.props.openSnackbar(`Copied ${type} to your clipboard`);
    };

    toggleTabVisibility = () => {
        this.setState({ showInactiveTabs: !this.state.showInactiveTabs });
    };

    render() {
        const { t } = this.props;
        const loadingContent = this.props.bunqMeTabsLoading ? <LinearProgress /> : <Divider />;

        const bunqMeTabs = this.props.bunqMeTabs.map(bunqMeTab => {
            if (this.state.showInactiveTabs === false && bunqMeTab.BunqMeTab.status !== "WAITING_FOR_PAYMENT") {
                return null;
            }
            return (
                <BunqMeTabListItem
                    bunqMeTab={bunqMeTab.BunqMeTab}
                    copiedValue={this.copiedValue}
                    limitedPermissions={this.props.limitedPermissions}
                    bunqMeTabLoading={this.props.bunqMeTabLoading}
                    bunqMeTabsLoading={this.props.bunqMeTabsLoading}
                    bunqMeTabPut={this.props.bunqMeTabPut}
                    user={this.props.user}
                />
            );
        });

        return (
            <List style={styles.left}>
                <ListSubheader>
                    bunq.me requests - {bunqMeTabs.length}
                    <ListItemSecondaryAction>
                        <Chip
                            style={styles.chip}
                            avatar={
                                <Avatar>
                                    <UrlIcon />
                                </Avatar>
                            }
                            component={Link}
                            label={t("bunqme links")}
                            to="/bunqme-personal"
                        />

                        <IconButton
                            aria-label="Display or hide expired and cancelled bunqme requests"
                            onClick={this.toggleTabVisibility}
                        >
                            {this.state.showInactiveTabs ? <Visible /> : <VisibleOff />}
                        </IconButton>
                        {this.props.secondaryActions}
                    </ListItemSecondaryAction>
                </ListSubheader>
                {loadingContent}
                <List>{bunqMeTabs}</List>
            </List>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        limitedPermissions: state.user.limited_permissions,

        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        bunqMeTabLoading: state.bunq_me_tab.loading,
        bunqMeTabsLoading: state.bunq_me_tabs.loading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        openSnackbar: message => dispatch(snackbarActions.open(message)),
        bunqMeTabPut: (userId, accountId, tabId, status) =>
            dispatch(bunqMeTabPut(userId, accountId, tabId, status))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(BunqMeTabList);
