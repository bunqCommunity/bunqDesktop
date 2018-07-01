import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import Icon from "@material-ui/core/Icon";

export default props => {
    const {
        category,
        style = {
            margin: 6
        },
        onClick,
        onDelete
    } = props;

    const chipProps = {
        style: style,
        label: category.label
    };

    // only add these if set so we don't make the chip clickable
    if (onClick)
        chipProps.onClick = event => {
            onClick({
                category: category,
                event: event
            });
        };
    if (onDelete)
        chipProps.onDelete = event => {
            onDelete({
                category: category,
                event: event
            });
        };

    return (
        <Chip
            {...chipProps}
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
