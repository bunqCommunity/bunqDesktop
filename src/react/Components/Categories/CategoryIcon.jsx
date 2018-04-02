import React from "react";
import Icon from "material-ui/Icon";

export default props => {
    return (
        <div style={{ width: 32 }}>
            <Icon style={{ color: props.category.color }}>
                {props.category.icon}
            </Icon>
        </div>
    );
};
