import React from "react";
import { Redirect, Route } from "react-router-dom";

export default ({
    component: Component,
    apiKey,
    userType,
    derivedPassword,
    ...rest
}) => {
    const componentHandler = rest.render ? rest.render : props => Component;

    // no user selected or no derived password set
    let redirectCondition =
        userType === false || derivedPassword === false || apiKey === false;

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
                )}
        />
    );
};
