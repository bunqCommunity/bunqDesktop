import React from "react";
import { connect } from "react-redux";
import AttachmentImage from "./AttachmentImage";
import LazyAttachmentImage from "./LazyAttachmentImage";

const BunqDesktopImage = ({ config, BunqJSClient, accounts, lazy = false, dispatch, ...props }) => {
    if (!config) return null;
    const Image = lazy ? LazyAttachmentImage : AttachmentImage;

    if (config.type === "LOCATION") {
        return <img src={config.value} {...props} />;
    }

    if (config.type === "IMAGE_UUID") {
        return <Image imageUUID={config.value} BunqJSClient={BunqJSClient} {...props} />;
    }

    if (config.type === "MONETARY_ACCOUNT_ID") {
        const monetaryAccount = accounts.find(account => {
            return account.id === config.value;
        });
        if (!monetaryAccount) return <img src="./images/default-avatar.svg" {...props} />;

        return <Image imageUUID={config.value} BunqJSClient={BunqJSClient} {...props} />;
    }

    return null;
};

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts
    };
};

export default connect(mapStateToProps)(BunqDesktopImage);
