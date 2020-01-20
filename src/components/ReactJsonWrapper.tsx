import React from "react";
import ReactJson from "react-json-view";

export default ({ style, data, name = null, ...rest }) => {
    return (
        <ReactJson
            style={style}
            src={data}
            name={name}
            theme="monokai"
            iconStyle="square"
            enableEdit={false}
            enableAdd={false}
            enabledDelete={false}
            enableClipboard={true}
            displayDataTypes={true}
            displayObjectSize={true}
            indentWidth={2}
            collapsed={1}
            collapseStringsAfterLength={30}
            {...rest}
        />
    );
};
