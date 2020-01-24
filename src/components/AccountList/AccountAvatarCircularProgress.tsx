import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import CircularProgress from "@material-ui/core/CircularProgress";
import { ReduxState } from "~store/index";

const styles = {
    overlayCircular: {
        position: "absolute",
        width: 68,
        height: 68,
        left: 12,
        top: 7
    }
};

interface IState {
    [key: string]: any;
}

interface IProps {
    account: any;
    theme: any;
    selected: boolean;
    style: CSSProperties;
}

const AccountAvatarCircularProgress = ({ account, theme, selected = false, style = {} }: ReturnType<typeof mapStateToProps> & IProps) => {
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
        <>
            <CircularProgress
                variant="static"
                value={savingsPercentage}
                style={{
                    ...styles.overlayCircular,
                    zIndex: 2,
                    left: selected ? 12 : 16,
                    ...style
                } as CSSProperties}
            />
            <div
                style={{
                    ...styles.overlayCircular,
                    zIndex: 1,
                    left: selected ? 12 : 16,
                    ...style
                } as CSSProperties}
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
        </>
    );
};

const mapStateToProps = (state: ReduxState) => {
    return {
        // @ts-ignore
        theme: state.options.theme,
    };
};

export default connect(mapStateToProps)(AccountAvatarCircularProgress);
