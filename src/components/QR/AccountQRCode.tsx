import React from "react";
import { connect } from "react-redux";
import QRCode from "./QRCode";

const styles = {
    qrcode: {
        backgroundColor: "white",
        width: 195,
        height: 195
    }
};

class AccountQRCode extends React.Component {
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

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,
        selectedAccount: state.accounts.selected_account
    };
};

export default connect(mapStateToProps)(AccountQRCode);
