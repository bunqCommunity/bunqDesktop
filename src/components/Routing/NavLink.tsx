import React from "react";
import { NavLink } from "react-router-dom";

type IProps = React.ComponentProps<typeof NavLink>;

export default class NavLinkHelper extends React.Component<IProps> {
    render() {
        return <NavLink {...this.props} activeClassName="active" />;
    }
}
