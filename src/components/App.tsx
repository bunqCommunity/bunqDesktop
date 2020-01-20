import BunqJSClient from "@bunq-community/bunq-js-client";
import React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";

import Routes from "./Routes";
import Layout from "~components/Layout";
import ErrorBoundary from "~components/ErrorBoundary";
import store from "~store/index";

// include translations setup
import "./i18n";

export interface IProps {
    analytics: boolean;
    BunqJSClient: BunqJSClient;
}

export default class App extends React.Component<IProps> {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <ErrorBoundary>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Provider store={store}>
                        <HashRouter>
                            <Layout
                                routesComponent={Routes}
                                analytics={this.props.analytics}
                                BunqJSClient={this.props.BunqJSClient}
                            />
                        </HashRouter>
                    </Provider>
                </MuiPickersUtilsProvider>
            </ErrorBoundary>
        );
    }
}
