import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Collapse from "material-ui/transitions/Collapse";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";
import AddIcon from "material-ui-icons/Add";

import AccountList from "../../Components/AccountList/AccountList";
import BunqMeTabList from "../../Components/BunqMeTabList";
import BunqMeTabForm from "./BunqMeTabForm";

import { bunqMeTabsUpdate } from "../../Actions/bunq_me_tabs";

const styles = {
    paper: {
        marginBottom: 20
    },
    paper: {
        marginBottom: 20
    }
};

class BunqMeTab extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showForm: false
        };
    }

    componentDidMount() {
        // set the current account selected on the dashboard as the active one
        this.props.accounts.map((account, accountKey) => {
            if (this.props.selectedAccount === account.id) {
                this.setState({ selectedAccount: accountKey });
            }
        });
    }

    updateTabs = (userId, accountId) =>
        this.props.bunqMeTabsUpdate(userId, accountId);

    toggleForm = () => this.setState({ showForm: !this.state.showForm });

    render() {
        const t=this.props.t;
        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("bunqme Requests")}`}</title>
                </Helmet>

                <Grid item xs={12} md={4}>
                    <Paper style={styles.paper}>
                        <AccountList
                            BunqJSClient={this.props.BunqJSClient}
                            updateExternal={this.updateTabs}
                            initialBunqConnect={this.props.initialBunqConnect}
                        />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Collapse
                        in={this.state.showForm}
                        unmountOnExit
                    >
                        <Paper style={styles.paper}>
                            <BunqMeTabForm
                                BunqJSClient={this.props.BunqJSClient}
                            />
                        </Paper>
                    </Collapse>
                    <Paper style={styles.paper}>
                        <BunqMeTabList
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                            secondaryActions={
                                <IconButton
                                    aria-label="Toggle the form"
                                    onClick={this.toggleForm}
                                >
                                    {this.state.showForm ? (
                                        <CloseIcon />
                                    ) : (
                                        <AddIcon />
                                    )}
                                </IconButton>
                            }
                        />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        selectedAccount: state.accounts.selectedAccount,
        accounts: state.accounts.accounts,
        user: state.user.user
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        bunqMeTabsUpdate: (userId, accountId) =>
            dispatch(bunqMeTabsUpdate(BunqJSClient, userId, accountId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(BunqMeTab)
);
