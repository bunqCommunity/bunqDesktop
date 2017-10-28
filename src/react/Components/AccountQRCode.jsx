import React from "react";
import { connect } from "react-redux";
import QRCode from "./QRCode";

const styles = {
    container: {
        width: 192,
        height: 192,
        backgroundColor: "white",
        padding: 5
    },
    qrcode: {
    }
};

class AccountQRCode extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const { style = {}, qrStyle = {}, ...props } = this.props;

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
            <div style={{ ...styles.container, ...style }}>
                <QRCode
                    imagePath="./images/qrlogo-empty.png"
                    style={{ ...styles.qrcode, ...qrStyle }}
                    value={value}
                />
            </div>
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
