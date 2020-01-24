import React from "react";
import { Redirect, Route } from "react-router-dom";

interface IProps {
    [key: string]: any;
}

export default ({ component: Component, derivedPassword, ...rest }: IProps) => {
    const componentHandler = rest.render ? rest.render : props => Component;

    // no user selected
    let redirectCondition = derivedPassword !== false;

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
