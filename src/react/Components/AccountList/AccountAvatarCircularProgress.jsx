import React from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";

const styles = {
    overlayCircular: {
        position: "absolute",
        width: 68,
        height: 68,
        left: 12,
        top: 7
    }
};
const AccountAvatarCircularProgress = ({ account, theme, selected = false, style = {} }) => {
    let isSavingsAccount = false;
    if (account.accountType === "MonetaryAccountSavings") {
        isSavingsAccount = true;
    }

    let savingsPercentage = 0;
    if (isSavingsAccount) {
        savingsPercentage = parseFloat(account.savings_goal_progress) * 100;
    }

    if (!isSavingsAccount) return null;

    return (
        <React.Fragment>
            <CircularProgress
                variant="static"
                value={savingsPercentage}
                style={{
                    ...styles.overlayCircular,
                    zIndex: 2,
                    left: selected ? 12 : 16,
                    ...style
                }}
            />
            <div
                style={{
                    ...styles.overlayCircular,
                    zIndex: 1,
                    left: selected ? 12 : 16,
                    ...style
                }}
            >
                <svg viewBox="22 22 44 44">
                    <circle
                        cx="44"
                        cy="44"
                        r="20.2"
                        fill="none"
                        strokeWidth="3.6"
                        stroke={theme === "DarkTheme" ? "#58585d" : "#e8e8e8"}
                        style={{
                            strokeDasharray: 126.92,
                            strokeDashoffset: 0
                        }}
                    />
                </svg>
            </div>
        </React.Fragment>
    );
};

const mapStateToProps = state => {
    return {
        theme: state.options.theme
    };
};

export default connect(mapStateToProps)(AccountAvatarCircularProgress);
