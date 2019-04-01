import React from "react";
import AttachmentImage from "./AttachmentImage";
import LazyAttachmentImage from "./LazyAttachmentImage";

const BunqDesktopImage = ({ config, BunqJSClient, lazy = false, ...props }) => {
    if (!config) return null;

    if (config.type === "IMAGE_UUID") {
        if (lazy) {
            return <LazyAttachmentImage imageUUID={config.value} BunqJSClient={BunqJSClient} {...props} />;
        }
        return <AttachmentImage imageUUID={config.value} BunqJSClient={BunqJSClient} {...props} />;
    }

    if (config.type === "LOCATION") {
        return <img src={config.value} {...props} />;
    }

    return null;
};

export default BunqDesktopImage;
