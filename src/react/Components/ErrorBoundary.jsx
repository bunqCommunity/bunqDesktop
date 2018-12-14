import React from "react";
import Typography from "@material-ui/core/Typography";

import Logger from "../Functions/Logger";
import TranslateButton from "./TranslationHelpers/Button";
import TranslateTypography from "./TranslationHelpers/Typography";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        Logger.error(error.stack);

        // Display fallback UI
        this.setState({ hasError: true, error: error, errorInfo: errorInfo });
    }

    clearError = () => {
        this.setState({ hasError: false, error: null, errorInfo: null });
        this.props.history.push("/");
    };

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div style={{ marginTop: 30 }}>
                    <TranslateTypography variant="h4">Something went wrong!</TranslateTypography>
                    <Typography variant="body2" component="summary" style={{ whiteSpace: "pre-wrap" }}>
                        {this.state.error.stack}
                    </Typography>
                    <br />
                    {this.props.recoverableError === true ? (
                        <TranslateButton variant="contained" color="primary" onClick={this.clearError}>
                            Return to dashboard
                        </TranslateButton>
                    ) : null}
                </div>
            );
        }
        return this.props.children;
    }
}
