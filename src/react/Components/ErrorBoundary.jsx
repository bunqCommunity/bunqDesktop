import React from "react";
import Typography from "material-ui/Typography";
import Logger from "../Helpers/Logger";
import Button from "material-ui/Button";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        Logger.error(error.stack);

        // Display fallback UI
        this.setState({ hasError: true, error, errorInfo });
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
                    <Typography type="display1">
                        Something went wrong!
                    </Typography>
                    <Typography
                        type="body2"
                        component="summary"
                        style={{ whiteSpace: "pre-wrap" }}
                    >
                        <Typography type="subheading" component="summary">
                            {this.state.error.toString()}
                        </Typography>
                        {this.state.errorInfo.componentStack}
                    </Typography>

                    {this.props.recoverableError === true ? (
                        <Button
                            raised
                            color="primary"
                            onClick={this.clearError}
                        >
                            Return to dashboard
                        </Button>
                    ) : null}
                </div>
            );
        }
        return this.props.children;
    }
}
