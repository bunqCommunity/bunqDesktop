import React from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

export default props => {
    const { onCopy, ...otherProps } = props;
    const onCopyWrap = copiedText => {
        navigator.clipboard.writeText(copiedText);
        if (onCopy) onCopy(copiedText);
    };

    return <CopyToClipboard onCopy={onCopyWrap} {...otherProps} />;
};
