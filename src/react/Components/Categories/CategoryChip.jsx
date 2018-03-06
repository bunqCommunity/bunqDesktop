import React from "react";
import Avatar from "material-ui/Avatar";
import Chip from "material-ui/Chip";
import Icon from "material-ui/Icon";

export default props => {
    const {
        category,
        style = {
            margin: 6
        }
    } = props;

    return (
        <Chip
            style={style}
            label={category.label}
            onDelete={console.log}
            avatar={
                <Avatar
                    style={{
                        backgroundColor: category.color
                    }}
                >
                    <Icon
                        style={{
                            height: 24,
                            width: 24
                        }}
                    >
                        {category.icon}
                    </Icon>
                </Avatar>
            }
        />
    );
};
