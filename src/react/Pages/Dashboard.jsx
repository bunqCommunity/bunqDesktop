import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import StickyBox from "react-sticky-box";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import Typography from "material-ui/Typography";

import CombinedList from "../Components/CombinedList";
import AccountList from "../Components/AccountList/AccountList";
import LoadOlderButton from "../Components/LoadOlderButton";

import { userLogin, userLogout } from "../Actions/user";

const styles = {
    btn: {
        width: "100%"
    }
};

class Dashboard extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidUpdate() {
        if (
            this.props.userType !== false &&
            this.props.userLoading === false &&
            this.props.usersLoading === false &&
            this.props.user === false
        ) {
            this.props.userLogin(this.props.userType, false);
        }
    }

    render() {
        const t = this.props.t;

        const userTypes = Object.keys(this.props.users);

        const switchUserText = t("Switch user");

        const displayName = this.props.user.first_name
            ? this.props.user.first_name
            : this.props.user.name;

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Dashboard")}`}</title>
                </Helmet>

                <Grid item xs={8} sm={10}>
                    <Typography variant="title" gutterBottom>
                        {`${t("Welcome")} ${displayName}`}
                    </Typography>
                </Grid>

                {/* hide the switch button if only one user is set */}
                {userTypes.length > 1 ? (
                    <Grid item xs={4} sm={2}>
                        <Button
                            style={styles.btn}
                            onClick={this.props.logoutUser}
                        >
                            {switchUserText}
                        </Button>
                    </Grid>
                ) : null}

                <Grid item xs={12} md={4}>
                    <StickyBox className={"sticky-container"}>
                        <Paper>
                            <AccountList
                                BunqJSClient={this.props.BunqJSClient}
                                initialBunqConnect={
                                    this.props.initialBunqConnect
                                }
                            />
                        </Paper>
                    </StickyBox>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper>
                        <CombinedList
                            BunqJSClient={this.props.BunqJSClient}
                            initialBunqConnect={this.props.initialBunqConnect}
                        />
                    </Paper>

                    <LoadOlderButton
                        BunqJSClient={this.props.BunqJSClient}
                        initialBunqConnect={this.props.initialBunqConnect}
                    />
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        users: state.users.users,
        userType: state.user.user_type,
        userLoading: state.user.loading,
        usersLoading: state.users.loading
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        logoutUser: () => dispatch(userLogout()),
        userLogin: (type, updated = false) =>
            dispatch(userLogin(BunqJSClient, type, updated))
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Dashboard)
);
