import React from "react";
import { Provider } from "react-redux";
import { HashRouter } from "react-router-dom";

import Routes from "./Routes.jsx";
import Main from "./Components/Main.jsx";
import Store from "./Store.jsx";

export default class App extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        return (
            <Provider store={Store()}>
                <HashRouter>
                    <Main routesComponent={Routes} />
                </HashRouter>
            </Provider>
        );
    }
}
