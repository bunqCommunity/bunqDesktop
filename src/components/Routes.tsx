import React from "react";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from "~components/Routing/PrivateRoute";
import PublicRoute from "~components/Routing/PublicRoute";
import CL from "~components/CodeSplitting/ComponentLoader";

import Dashboard from "~pages/Dashboard/Dashboard";
import NotFound from "~pages/NotFound";
import LoginPassword from "~pages/LoginPassword";
import Login from "~pages/Login/Login";

const privateRoutes = [
    /**
     * Main pages
     */
    {
        exact: true,
        path: "/",
        component: Dashboard
    },
    {
        path: "/pay",
        component: CL(() => import(/* webpackChunkName: "pay" */ "~pages/Pay/Pay"))
    },
    {
        path: "/request",
        component: CL(() => import(/* webpackChunkName: "requestinquiry" */ "~pages/RequestInquiry/RequestInquiry"))
    },
    {
        path: "/bunqme-tab",
        component: CL(() => import(/* webpackChunkName: "bunqmetab" */ "~pages/BunqMeTab/BunqMeTab"))
    },
    {
        path: "/bunqme-personal",
        component: CL(() => import(/* webpackChunkName: "bunqmepersonal" */ "~pages/BunqMePersonal/BunqMePersonal"))
    },
    {
        path: "/cards",
        component: CL(() => import(/* webpackChunkName: "cards" */ "~pages/Cards/Cards"))
    },
    {
        path: "/scheduled-payments",
        component: CL(() =>
            import(/* webpackChunkName: "scheduled_payments" */ "~pages/ScheduledPayments/ScheduledPayments")
        )
    },
    /**
     * Extra pages
     */
    {
        path: "/exports",
        component: CL(() => import(/* webpackChunkName: "exports" */ "~pages/Exports"))
    },
    {
        path: "/pending-payments",
        component: CL(() => import(/* webpackChunkName: "pendingPayments" */ "~pages/PendingPayments/PendingPayments"))
    },
    {
        path: "/stats",
        component: CL(() => import(/* webpackChunkName: "stats" */ "~pages/Stats/Stats"))
    },
    {
        path: "/contacts",
        component: CL(() => import(/* webpackChunkName: "contacts" */ "~pages/Contacts/Contacts"))
    },
    {
        path: "/category-dashboard",
        component: CL(() =>
            import(/* webpackChunkName: "category_dashboard" */ "~pages/CategoryDashboard/CategoryDashboard")
        )
    },
    {
        path: "/rules-dashboard",
        component: CL(() => import(/* webpackChunkName: "rules_dashboard" */ "~pages/RuleDashboard/RuleDashboard"))
    },
    {
        path: "/rule-page/:ruleId",
        component: CL(() => import(/* webpackChunkName: "rules_page" */ "~pages/RulePage/RulePage"))
    },
    {
        path: "/savings-goals",
        component: CL(() => import(/* webpackChunkName: "savings_goals" */ "~pages/SavingsGoals/SavingsGoals"))
    },
    {
        path: "/savings-goal-page/:savingsGoalId",
        component: CL(() =>
            import(/* webpackChunkName: "savings_goal_page" */ "~pages/SavingsGoalPage/SavingsGoalPage")
        )
    },
    /**
     * Event info pages
     */
    {
        path: "/payment/:paymentId/:accountId?",
        component: CL(() => import(/* webpackChunkName: "paymentinfo" */ "~pages/PaymentInfo"))
    },
    {
        path: "/request-response-info/:requestResponseId/:accountId?",
        component: CL(() =>
            import(/* webpackChunkName: "requestresponseinfo" */ "~pages/RequestResponseInfo/RequestResponseInfo")
        )
    },
    {
        path: "/request-inquiry-info/:requestInquiryId/:accountId?",
        component: CL(() => import(/* webpackChunkName: "requestinquiryinfo" */ "~pages/RequestInquiryInfo"))
    },
    {
        path: "/mastercard-action-info/:masterCardActionId/:accountId?",
        component: CL(() => import(/* webpackChunkName: "mastercardactioninfo" */ "~pages/MasterCardActionInfo"))
    },
    /**
     * Monetary account info and settings pages
     */
    {
        path: "/account-info/:accountId",
        component: CL(() => import(/* webpackChunkName: "accountinfo" */ "~pages/AccountInfo"))
    },
    {
        path: "/new-account",
        component: CL(() => import(/* webpackChunkName: "addaccount" */ "~pages/AddAccount"))
    },
    {
        path: "/connect/:accountId",
        component: CL(() => import(/* webpackChunkName: "connect" */ "~pages/Connect/Connect"))
    },
    {
        path: "/profile",
        component: CL(() => import(/* webpackChunkName: "profile" */ "~pages/Profile/Profile"))
    }
];

// These pages are always available
const standardRoutes = [
    {
        path: "/settings",
        component: CL(() => import(/* webpackChunkName: "settings" */ "~pages/Settings/Settings"))
    },
    {
        path: "/application-info",
        component: CL(() => import(/* webpackChunkName: "applicationinfo" */ "~pages/ApplicationInfo"))
    },
    {
        path: "/debug-page",
        component: CL(() => import(/* webpackChunkName: "debug" */ "~pages/DebugPage"))
    },
    {
        path: "/disclaimer",
        component: CL(() => import(/* webpackChunkName: "disclaimer" */ "~pages/Disclaimer"))
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/switch-api-keys",
        component: CL(() => import(/* webpackChunkName: "switch_api_keys" */ "~pages/SwitchApiKeys"))
    }
];

// Only allowed if no password is set
const publicRoutes = [
    {
        path: "/password",
        component: LoginPassword
    }
];

// router react component
export default class Routes extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const privateRouteComponents = privateRoutes.map((route, idx) => {
            const { component, ...props } = route;
            const Component = route.component;
            return (
                <PrivateRoute
                    key={idx}
                    apiKey={this.props.apiKey}
                    userType={this.props.userType}
                    derivedPassword={this.props.derivedPassword}
                    render={props => <Component {...props} {...this.props.childProps} />}
                    {...props}
                />
            );
        });
        const stantardRouteComponents = standardRoutes.map((route, idx) => {
            const { component, ...props } = route;
            const Component = route.component;
            return <Route key={idx} render={props => <Component {...props} {...this.props.childProps} />} {...props} />;
        });

        const publicRouteComponents = publicRoutes.map((route, idx) => {
            const { component, ...props } = route;
            const Component = route.component;
            return (
                <PublicRoute
                    key={idx}
                    derivedPassword={this.props.derivedPassword}
                    render={props => <Component {...props} {...this.props.childProps} />}
                    {...props}
                />
            );
        });

        return (
            <Route
                render={wrapperProps => (
                    <Switch key={wrapperProps.location.key} location={wrapperProps.location}>
                        {privateRouteComponents}
                        {stantardRouteComponents}
                        {publicRouteComponents}

                        <Route render={props => <NotFound {...props} {...this.props.childProps} />} />
                    </Switch>
                )}
            />
        );
    }
}
