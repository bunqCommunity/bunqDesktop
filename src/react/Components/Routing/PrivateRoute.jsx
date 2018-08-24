import React from "react";
import { Redirect, Route } from "react-router-dom";

export default ({
    component: Component,
    apiKey,
    userType,
    derivedPassword,
    ignoreApiKey = false,
    ignoreUserType = false,
    ...rest
}) => {
    const componentHandler = rest.render ? rest.render : props => Component;

    // no user selected or no derived password set
    let redirectCondition =
        derivedPassword === false ||
        (userType === false && ignoreUserType === false) ||
        (apiKey === false && ignoreApiKey === false);

    return (
        <Route
            {...rest}
            render={props =>
                redirectCondition ? (
                    <Redirect
                        to={{
                            pathname: "/login",
                            state: { from: props.location }
                        }}
                    />
                ) : (
                    componentHandler(props)
                )
            }
        />
    );
};
