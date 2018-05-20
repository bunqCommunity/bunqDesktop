import React from "react";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from "./Components/Routing/PrivateRoute";
import PublicRoute from "./Components/Routing/PublicRoute";
import CL from "./Components/CodeSplitting/ComponentLoader";

import Dashboard from "./Pages/Dashboard";
import LoginPassword from "./Pages/LoginPassword";
import Login from "./Pages/Login/Login";
const NotFound = CL(() =>
    import(/* webpackChunkName: "notfound" */ "./Pages/NotFound")
);
const Pay = CL(() => import(/* webpackChunkName: "pay" */ "./Pages/Pay/Pay"));
const ScheduledPayments = CL(() => import(/* webpackChunkName: "pay" */ "./Pages/ScheduledPayments/ScheduledPayments"));
const BunqMeTab = CL(() =>
    import(/* webpackChunkName: "bunqmetab" */ "./Pages/BunqMeTab/BunqMeTab")
);
const RequestInquiry = CL(() =>
    import(/* webpackChunkName: "requestinquiry" */ "./Pages/RequestInquiry/RequestInquiry")
);
const RequestResponseInfo = CL(() =>
    import(/* webpackChunkName: "requestresponseinfo" */ "./Pages/RequestResponseInfo/RequestResponseInfo")
);
const RequestInquiryInfo = CL(() =>
    import(/* webpackChunkName: "requestinquiryinfo" */ "./Pages/RequestInquiryInfo")
);
const MasterCardActionInfo = CL(() =>
    import(/* webpackChunkName: "mastercardactioninfo" */ "./Pages/MasterCardActionInfo")
);
const PaymentInfo = CL(() =>
    import(/* webpackChunkName: "paymentinfo" */ "./Pages/PaymentInfo")
);
const ApplicationInfo = CL(() =>
    import(/* webpackChunkName: "applicationinfo" */ "./Pages/ApplicationInfo")
);
const AccountInfo = CL(() =>
    import(/* webpackChunkName: "accountinfo" */ "./Pages/AccountInfo/AccountInfo")
);
const AddAccount = CL(() =>
    import(/* webpackChunkName: "addaccount" */ "./Pages/AddAccount")
);
const Stats = CL(() =>
    import(/* webpackChunkName: "stats" */ "./Pages/Stats/Stats")
);
const CategoryDashboard = CL(() =>
    import(/* webpackChunkName: "category_dashboard" */ "./Pages/CategoryDashboard/CategoryDashboard")
);
const Card = CL(() =>
    import(/* webpackChunkName: "cards" */ "./Pages/Cards/Card")
);
const DebugPage = CL(() =>
    import(/* webpackChunkName: "debug" */ "./Pages/DebugPage")
);
const Contacts = CL(() =>
    import(/* webpackChunkName: "contacts" */ "./Pages/Contacts/Contacts")
);
const Profile = CL(() =>
    import(/* webpackChunkName: "profile" */ "./Pages/Profile/Profile")
);
const Settings = CL(() =>
    import(/* webpackChunkName: "settings" */ "./Pages/Settings")
);
const Exports = CL(() =>
    import(/* webpackChunkName: "exports" */ "./Pages/Exports")
);
const RuleDashboard = CL(() =>
    import(/* webpackChunkName: "rules_dashboard" */ "./Pages/RuleDashboard/RuleDashboard")
);
const RulePage = CL(() =>
    import(/* webpackChunkName: "rules_page" */ "./Pages/RulePage/RulePage")
);
const SwitchApiKeys = CL(() =>
    import(/* webpackChunkName: "switch_api_keys" */ "./Pages/SwitchApiKeys")
);
const Disclaimer = CL(() =>
    import(/* webpackChunkName: "disclaimer" */ "./Pages/Disclaimer")
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
                            path="/scheduled-payments"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <ScheduledPayments {...props} {...this.props.childProps} />
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
                            path="/request-response-info/:requestResponseId/:accountId?"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <RequestResponseInfo
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/request-inquiry-info/:requestInquiryId/:accountId?"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <RequestInquiryInfo
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/mastercard-action-info/:masterCardActionId/:accountId?"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <MasterCardActionInfo
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

                        <PrivateRoute
                            path="/new-account"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <AddAccount
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/card"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <Card {...props} {...this.props.childProps} />
                            )}
                        />

                        <PrivateRoute
                            path="/exports"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <Exports
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/contacts"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <Contacts
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/stats"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <Stats {...props} {...this.props.childProps} />
                            )}
                        />

                        <PrivateRoute
                            path="/category-dashboard"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <CategoryDashboard
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/rules-dashboard"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <RuleDashboard
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/rule-page/:ruleId"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <RulePage
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/profile"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            render={props => (
                                <Profile
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <PrivateRoute
                            path="/switch-api-keys"
                            apiKey={this.props.apiKey}
                            userType={this.props.userType}
                            derivedPassword={this.props.derivedPassword}
                            ignoreApiKey={true}
                            ignoreUserType={true}
                            render={props => (
                                <SwitchApiKeys
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

                        <Route
                            path="/debug-page"
                            render={props => (
                                <DebugPage
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <Route
                            path="/settings"
                            render={props => (
                                <Settings
                                    {...props}
                                    {...this.props.childProps}
                                />
                            )}
                        />

                        <Route
                            path="/disclaimer"
                            render={props => (
                                <Disclaimer
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
