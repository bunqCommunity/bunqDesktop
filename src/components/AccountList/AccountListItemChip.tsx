import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Chip from "@material-ui/core/Chip";

import LazyAttachmentImage from "~components/AttachmentImage/LazyAttachmentImage";

export default props => {
    const {
        account,
        style = {
            margin: 6
        },
        onClick,
        onDelete
    } = props;

    const chipProps = {
        style: style,
        label: account.description
    };

    // only add these if set so we don't make the chip clickable
    if (onClick)
        chipProps.onClick = event => {
            onClick({
                account: account,
                event: event
            });
        };
    if (onDelete)
        chipProps.onDelete = event => {
            onDelete({
                account: account,
                event: event
            });
        };

    return (
        <Chip
            {...chipProps}
            avatar={
                <Avatar>
                    <LazyAttachmentImage
                        imageUUID={account.avatar.image[0].attachment_public_uuid}
                        style={{ width: 32, height: 32 }}
                    />
                </Avatar>
            }
        />
    );
};
