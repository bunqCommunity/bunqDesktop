import React from "react";
import { Redirect, Route } from "react-router-dom";

export default ({ component: Component, user, ...rest }) => {
    const componentHandler = rest.render ? rest.render : props => Component;
    return (
        <Route
            {...rest}
            render={props =>
                user === false ? (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                ) : (
                    componentHandler(props)
                )}
        />
    );
};
