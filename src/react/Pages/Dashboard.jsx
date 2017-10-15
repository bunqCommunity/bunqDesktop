import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Grid from "material-ui/Grid";
import PaymentList from "../Components/PaymentList";
import AccountList from "../Components/AccountList";

import { userLogin, userLogout } from "../Actions/user";
import { accountsUpdate } from "../Actions/accounts";

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

    componentDidMount() {
        this.props.updateAccounts();
    }

    render() {
        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqWeb - Dashboard`}</title>
                </Helmet>

                <Grid item xs={8} sm={10}>
                    <h1>Welcome {this.props.user.displayName}</h1>
                </Grid>

                <Grid item xs={4} sm={2}>
                    <Button style={styles.btn} onClick={this.props.logoutUser}>
                        Switch User
                    </Button>
                </Grid>

                <Grid item xs={12} md={4}>
                    <Paper>
                        <AccountList />
                    </Paper>
                </Grid>

                <Grid item xs={12} md={8}>
                    <Paper>
                        <PaymentList />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user
    };
};

const mapDispatchToProps = dispatch => {
    return {
        loginUser: (id, type) => dispatch(userLogin(id, type)),
        logoutUser: () => dispatch(userLogout()),
        updateAccounts: () => dispatch(accountsUpdate())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
