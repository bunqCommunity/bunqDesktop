import React from "react";
import CustomIcon from "../CustomIcon";

export default props => {
    return (
        <div style={{ width: 32 }}>
            <CustomIcon style={{ color: props.category.color }}>{props.category.icon}</CustomIcon>
        </div>
    );
};
