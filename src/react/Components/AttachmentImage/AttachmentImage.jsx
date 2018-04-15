import React from "react";
import localforage from "../../ImportWrappers/localforage";
import Logger from "../../Helpers/Logger";

const defaultImageUrl =
    "./images/default-avatar.svg";

class AttachmentImage extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false
        };
    }

    componentDidMount() {
        this._isMounted = true;
        this.checkImage();
    }

    componentWillUnmount() {
        // reset timeout before unmount
        clearTimeout(this.timeout);
        this._isMounted = false;
    }

    componentDidUpdate(nextProps) {
        if (this.props.imageUUID !== nextProps.imageUUID) {
            this.checkImage();
        }
    }

    checkImage() {
        if (this.props.imageUUID === false) {
            this.setState({ imageUrl: defaultImageUrl });
            return;
        }

        // configure the localforage instance
        localforage.config({
            driver: localforage.INDEXEDDB,
            name: "BunqDesktop",
            version: 1.0,
            storeName: "bunq_desktop_images",
            description: "Image cache for bunq desktop in indexed db"
        });

        // set a timeout as a fallback incase loading the image takes too long
        this.timeout = setTimeout(() => {
            if (this.imageUrl === false) {
                // still no image, fallback to temporary placeholder
                this.setState({
                    imageUrl: defaultImageUrl
                });
            }
        }, 500);

        this.loadImage().then(success => {
            // remove the fallback timeout
            clearTimeout(this.timeout);
        });
    }

    loadImage = async () => {
        const storageKey = `image_${this.props.imageUUID}`;
        const base64UrlStored = await localforage.getItem(storageKey);
        if (base64UrlStored === null) {
            // no image, fallback to default while we load the image remotely
            if (this._isMounted) {
                this.setState({
                    imageUrl: defaultImageUrl
                });
            }
            // remove the fallback timeout
            clearTimeout(this.timeout);

            try {
                // get raw image contents
                const base64Url = await this.props.BunqJSClient.api.attachmentContent.get(
                    this.props.imageUUID
                );

                // set the url first
                if (this._isMounted) {
                    this.setState({
                        imageUrl: base64Url
                    });
                }

                // store the full url in storage
                await localforage.setItem(storageKey, base64Url);

                return true;
            } catch (ex) {
                Logger.error(ex);
            }
        }

        // set the url
        if (this._isMounted) {
            this.setState({
                imageUrl: base64UrlStored
            });
        }
        return true;
    };

    render() {
        // exclude custom props
        const { BunqJSClient, imageUUID, ...props } = this.props;

        return this.imageUrl === false ? (
            <div {...props} />
        ) : (
            <img src={this.state.imageUrl} {...props} />
        );
    }
}

export default AttachmentImage;
