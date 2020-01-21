import React, { CSSProperties } from "react";
import { connect } from "react-redux";
import { ReduxState } from "~store/index";
import QRCode from "./QRCode";

const styles = {
    qrcode: {
        backgroundColor: "white",
        width: 195,
        height: 195
    }
};

interface IState {
}

interface IProps {
    style: CSSProperties;
}

class AccountQRCode extends React.Component<ReturnType<typeof mapStateToProps> & IProps> {
    state: IState;

    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { style = {}, ...props } = this.props;

        let selectedAccount = props.selectedAccount;
        if (props.accountId !== false) {
            selectedAccount = props.accountId;
        }

        let currentAccount = false;
        props.accounts.map(account => {
            if (account.id === selectedAccount) {
                currentAccount = account;
            }
        });

        if (currentAccount === false) return null;

        const value = `https://qr.bunq.com/2/8/${currentAccount.avatar.anchor_uuid}`;

        return (
            <QRCode
                size={props.size}
                style={{ ...styles.qrcode, height: props.size, width: props.size, ...style }}
                value={value}
            />
        );
    }
}

AccountQRCode.defaultProps = {
    accountId: false,
    size: 195
};

const mapStateToProps = (state: ReduxState) => {
    return {
        accounts: state.accounts.accounts,
        selectedAccount: state.accounts.selectedAccount
    };
};

export default connect(mapStateToProps)(AccountQRCode);
