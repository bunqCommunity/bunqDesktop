import React from "react";
import Logger from "../../Helpers/Logger";

export default ({ isLoading, pastDelay, error }) => {
    if (isLoading && pastDelay) {
        // during loading but delay has been passed
        return null;
    } else if (error && !isLoading) {
        // failed to load the component
        Logger.error("Failed to load", error);
        return null;
    } else {
        // during loading
        return <div key="loading-component" />;
    }
};
