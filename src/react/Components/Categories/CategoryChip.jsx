import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";
import CustomIcon from "../CustomIcon";

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
                    <CustomIcon
                        style={{
                            height: 24
                        }}
                    >
                        {category.icon}
                    </CustomIcon>
                </Avatar>
            }
        />
    );
};
