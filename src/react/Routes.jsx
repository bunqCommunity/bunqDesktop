import React from "react";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from "./Components/Routing/PrivateRoute";
import PublicRoute from "./Components/Routing/PublicRoute";
import CL from "./Components/CodeSplitting/ComponentLoader";

import Dashboard from "./Pages/Dashboard/Dashboard";
import LoginPassword from "./Pages/LoginPassword";
const Login = CL(() =>
    import(/* webpackChunkName: "login" */ "./Pages/Login/Login")
);
const NotFound = CL(() =>
    import(/* webpackChunkName: "notfound" */ "./Pages/NotFound")
);
const Pay = CL(() => import(/* webpackChunkName: "pay" */ "./Pages/Pay"));
const BunqMeTab = CL(() =>
    import(/* webpackChunkName: "bunqmetab" */ "./Pages/BunqMeTab/BunqMeTab")
);
const RequestInquiry = CL(() =>
    import(/* webpackChunkName: "requestinquiry" */ "./Pages/RequestInquiry/RequestInquiry")
);
const PaymentInfo = CL(() =>
    import(/* webpackChunkName: "paymentinfo" */ "./Pages/PaymentInfo")
);
const ApplicationInfo = CL(() =>
    import(/* webpackChunkName: "applicationinfo" */ "./Pages/ApplicationInfo")
);
const AccountInfo = CL(() =>
    import(/* webpackChunkName: "accountinfo" */ "./Pages/AccountInfo")
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
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <Dashboard
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/pay"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <Pay {...props} {...this.props.childProps} />
                            )}
                        />

                        <PrivateRoute
                            path="/request"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <RequestInquiry
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/bunqme-tab"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <BunqMeTab
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/payment/:paymentId/:accountId?"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <PaymentInfo
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/account-info/:accountId"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <AccountInfo
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <Route
                            path="/login"
                            render={props => (
                                <Login {...props} {...this.props.childProps} />
                            )}
                        />

                        <Route
                            path="/application-info"
                            render={props => (
                                <ApplicationInfo
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PublicRoute
                            path="/password"
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <LoginPassword
                                    {...props}
                                    {...this.props.childProps}
                                />
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
