import React from "react";
import VisibilitySensor from "react-visibility-sensor";
import AttachmentImage from "./AttachmentImage";

class LazyAttachmentImage extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
        this.state = {
            visible: false
        };
    }

    onVisibilityChange = visible => {
        this.setState({ visible: visible });
    };

    render() {
        return (
            <VisibilitySensor onChange={this.onVisibilityChange}>
                {state => {
                    // if currently visible or previously visible render the image
                    return state.isVisible || this.state.visible ? <AttachmentImage {...this.props} /> : <div />;
                }}
            </VisibilitySensor>
        );
    }
}

export default LazyAttachmentImage;
