import React from "react";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from "./Components/Routing/PrivateRoute";
import PublicRoute from "./Components/Routing/PublicRoute";

import Dashboard from "./Pages/Dashboard/Dashboard";
import Login from "./Pages/Login/Login.jsx";
import LoginPassword from "./Pages/LoginPassword";
import Pay from "./Pages/Pay";
import PaymentInfo from "./Pages/PaymentInfo";
import NotFound from "./Pages/NotFound";

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
                            userType={this.props.user_type}
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
                            userType={this.props.user_type}
                            render={props => (
                                <Pay {...props} {...this.props.childProps} />
                            )}
                        />

                        <PrivateRoute
                            path="/payment/:paymentId"
                            user={this.props.user}
                            userType={this.props.user_type}
                            render={props => (
                                <PaymentInfo
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PublicRoute
                            path="/login"
                            user={this.props.user}
                            userType={this.props.user_type}
                            render={props => (
                                <Login {...props} {...this.props.childProps} />
                            )}
                        />

                        <PublicRoute
                            path="/password"
                            user={this.props.user}
                            render={props => (
                                <LoginPassword {...props} {...this.props.childProps} />
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
