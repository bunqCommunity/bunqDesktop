import React from "react";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from "./Components/Sub/PrivateRoute";
import PublicRoute from "./Components/Sub/PublicRoute";
import ComponentLoader from "./Components/Sub/ComponentLoader";

const Dashboard = ComponentLoader(() =>
    import(/* webpackChunkName: "dashboard" */ "./Pages/Dashboard")
);
const Login = ComponentLoader(() =>
    import(/* webpackChunkName: "login" */ "./Pages/Login")
);
const Pay = ComponentLoader(() =>
    import(/* webpackChunkName: "pay" */ "./Pages/Pay")
);
const PaymentInfo = ComponentLoader(() =>
    import(/* webpackChunkName: "paymentinfo" */ "./Pages/PaymentInfo")
);
const NotFound = ComponentLoader(() =>
    import(/* webpackChunkName: "notfound" */ "./Pages/NotFound")
);

// router react component
export default class Routes extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Route
                render={wrapperProps => (
                    <Switch
                        key={wrapperProps.location.key}
                        location={wrapperProps.location}
                    >
                        <PrivateRoute
                            exact
                            path="/"
                            user={this.props.user}
                            render={props => (
                                <Dashboard
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/pay"
                            user={this.props.user}
                            render={props => (
                                <Pay {...props} {...this.props.childProps} />
                            )}
                        />

                        <PrivateRoute
                            path="/payment/:paymentId"
                            user={this.props.user}
                            render={props => (
                                <PaymentInfo {...props} {...this.props.childProps} />
                            )}
                        />

                        <PublicRoute
                            path="/login"
                            user={this.props.user}
                            render={props => (
                                <Login {...props} {...this.props.childProps} />
                            )}
                        />

                        <Route
                            render={props => (
                                <NotFound
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />
                    </Switch>
                )}
            />
        );
    }
}
