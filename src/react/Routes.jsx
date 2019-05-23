import React from "react";
import { Route, Switch } from "react-router-dom";

import PrivateRoute from "./Components/Routing/PrivateRoute";
import PublicRoute from "./Components/Routing/PublicRoute";
import CL from "./Components/CodeSplitting/ComponentLoader";

import Dashboard from "./Pages/Dashboard/Dashboard";
import NotFound from "./Pages/NotFound";
import LoginPassword from "./Pages/LoginPassword";
import Login from "./Pages/Login/Login";

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
        component: CL(() => import(/* webpackChunkName: "pay" */ "./Pages/Pay/Pay"))
    },
    {
        path: "/request",
        component: CL(() => import(/* webpackChunkName: "requestinquiry" */ "./Pages/RequestInquiry/RequestInquiry"))
    },
    {
        path: "/bunqme-tab",
        component: CL(() => import(/* webpackChunkName: "bunqmetab" */ "./Pages/BunqMeTab/BunqMeTab"))
    },
    {
        path: "/bunqme-personal",
        component: CL(() => import(/* webpackChunkName: "bunqmepersonal" */ "./Pages/BunqMePersonal/BunqMePersonal"))
    },
    {
        path: "/cards",
        component: CL(() => import(/* webpackChunkName: "cards" */ "./Pages/Cards/Cards"))
    },
    {
        path: "/scheduled-payments",
        component: CL(() =>
            import(/* webpackChunkName: "scheduled_payments" */ "./Pages/ScheduledPayments/ScheduledPayments")
        )
    },
    /**
     * Extra pages
     */
    {
        path: "/exports",
        component: CL(() => import(/* webpackChunkName: "exports" */ "./Pages/Exports"))
    },
    {
        path: "/pending-payments",
        component: CL(() => import(/* webpackChunkName: "pendingPayments" */ "./Pages/PendingPayments/PendingPayments"))
    },
    {
        path: "/stats",
        component: CL(() => import(/* webpackChunkName: "stats" */ "./Pages/Stats/Stats"))
    },
    {
        path: "/contacts",
        component: CL(() => import(/* webpackChunkName: "contacts" */ "./Pages/Contacts/Contacts"))
    },
    {
        path: "/category-dashboard",
        component: CL(() =>
            import(/* webpackChunkName: "category_dashboard" */ "./Pages/CategoryDashboard/CategoryDashboard")
        )
    },
    {
        path: "/rules-dashboard",
        component: CL(() => import(/* webpackChunkName: "rules_dashboard" */ "./Pages/RuleDashboard/RuleDashboard"))
    },
    {
        path: "/rule-page/:ruleId",
        component: CL(() => import(/* webpackChunkName: "rules_page" */ "./Pages/RulePage/RulePage"))
    },
    {
        path: "/savings-goals",
        component: CL(() => import(/* webpackChunkName: "savings_goals" */ "./Pages/SavingsGoals/SavingsGoals"))
    },
    {
        path: "/savings-goal-page/:savingsGoalId",
        component: CL(() =>
            import(/* webpackChunkName: "savings_goal_page" */ "./Pages/SavingsGoalPage/SavingsGoalPage")
        )
    },
    /**
     * Event info pages
     */
    {
        path: "/payment/:paymentId/:accountId?",
        component: CL(() => import(/* webpackChunkName: "paymentinfo" */ "./Pages/PaymentInfo"))
    },
    {
        path: "/request-response-info/:requestResponseId/:accountId?",
        component: CL(() =>
            import(/* webpackChunkName: "requestresponseinfo" */ "./Pages/RequestResponseInfo/RequestResponseInfo")
        )
    },
    {
        path: "/request-inquiry-info/:requestInquiryId/:accountId?",
        component: CL(() => import(/* webpackChunkName: "requestinquiryinfo" */ "./Pages/RequestInquiryInfo"))
    },
    {
        path: "/mastercard-action-info/:masterCardActionId/:accountId?",
        component: CL(() => import(/* webpackChunkName: "mastercardactioninfo" */ "./Pages/MasterCardActionInfo"))
    },
    /**
     * Monetary account info and settings pages
     */
    {
        path: "/account-info/:accountId",
        component: CL(() => import(/* webpackChunkName: "accountinfo" */ "./Pages/AccountInfo"))
    },
    {
        path: "/new-account",
        component: CL(() => import(/* webpackChunkName: "addaccount" */ "./Pages/AddAccount"))
    },
    {
        path: "/connect/:accountId",
        component: CL(() => import(/* webpackChunkName: "connect" */ "./Pages/Connect/Connect"))
    },
    {
        path: "/profile",
        component: CL(() => import(/* webpackChunkName: "profile" */ "./Pages/Profile/Profile"))
    }
];

// These pages are always available
const standardRoutes = [
    {
        path: "/settings",
        component: CL(() => import(/* webpackChunkName: "settings" */ "./Pages/Settings/Settings"))
    },
    {
        path: "/application-info",
        component: CL(() => import(/* webpackChunkName: "applicationinfo" */ "./Pages/ApplicationInfo"))
    },
    {
        path: "/debug-page",
        component: CL(() => import(/* webpackChunkName: "debug" */ "./Pages/DebugPage"))
    },
    {
        path: "/disclaimer",
        component: CL(() => import(/* webpackChunkName: "disclaimer" */ "./Pages/Disclaimer"))
    },
    {
        path: "/login",
        component: Login
    },
    {
        path: "/switch-api-keys",
        component: CL(() => import(/* webpackChunkName: "switch_api_keys" */ "./Pages/SwitchApiKeys"))
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
        const privateRouteComponents = privateRoutes.map(route => {
            const { component, ...props } = route;
            const Component = route.component;
            return (
                <PrivateRoute
                    apiKey={this.props.apiKey}
                    userType={this.props.userType}
                    derivedPassword={this.props.derivedPassword}
                    render={props => <Component {...props} {...this.props.childProps} />}
                    {...props}
                />
            );
        });
        const stantardRouteComponents = standardRoutes.map(route => {
            const { component, ...props } = route;
            const Component = route.component;
            return <Route render={props => <Component {...props} {...this.props.childProps} />} {...props} />;
        });

        const publicRouteComponents = publicRoutes.map(route => {
            const { component, ...props } = route;
            const Component = route.component;
            return (
                <PublicRoute
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
