import React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";
import DateFnsUtils from "material-ui-pickers/utils/date-fns-utils";
import MuiPickersUtilsProvider from "material-ui-pickers/MuiPickersUtilsProvider";

import Routes from "./Routes.jsx";
import Layout from "./Components/Layout";
import ErrorBoundary from "./Components/ErrorBoundary";
import Store from "./Store.jsx";

// include translations setup
import "./i18n";

export default class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <ErrorBoundary>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Provider store={Store()}>
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
