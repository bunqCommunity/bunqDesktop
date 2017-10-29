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

        let currentAccount = false;
        props.accounts.map(account => {
            if (account.MonetaryAccountBank.id === props.selectedAccount) {
                currentAccount = account.MonetaryAccountBank;
            }
        });

        if (currentAccount === false) return null;

        const value = `https://qr.bunq.com/2/8/${currentAccount.avatar
            .anchor_uuid}`;

        return (
            <QRCode
                imagePath="./images/qrlogo-empty.png"
                style={{ ...styles.qrcode, ...style }}
                value={value}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts.accounts,
        selectedAccount: state.accounts.selectedAccount
    };
};

export default connect(mapStateToProps)(AccountQRCode);
