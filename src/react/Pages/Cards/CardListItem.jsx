import React from "react";
import { connect } from "react-redux";

import Card, { CardContent, CardMedia } from "material-ui/Card";
import Button from "material-ui/Button";
import Typography from "material-ui/Typography";

import NavLink from "../../Components/Routing/NavLink";
import { formatMoney, humanReadableDate } from "../../Helpers/Utils";

import store from "store";

const styles = {
    cardWrapper: {},
    card: {},
    details: {},
    content: {},
    cover: {},
    cardImage: {}
};

class CardListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const card = this.props.card;
        const accounts = this.props.accounts;
        const currentAccount = accounts.accounts.find(
            account =>
                account.id == card.pin_code_assignment[0].monetary_account_id
        );

        let cardImage = null;
        let cardType = null;
        let connectedAccountName = currentAccount.description;
        switch (card.type) {
            case "MASTERCARD":
                cardType = "MasterCard";
                cardImage = "images/bunq-mastercard.png";
                break;
            case "MAESTRO":
                cardType = "Maestro";
                cardImage = "images/bunq-maestro.png";
                break;
            case "MAESTRO_MOBILE_NFC":
                cardType = "Mobile NFC";
                cardImage = "images/bunq-nfc-mobile-card.png";
                break;
            default:
                cardType = "Unknown";
                cardImage = "images/bunq-maestro.png";
                break;
        }

        if (card.status !== "ACTIVE") {
            return null;
        }

        return [
            <div
                className="single-card"
                style={styles.cardWrapper}
                onClick={this.props.onClick}
            >
                <img className="card-image" src={cardImage} />
            </div>
        ];
    }
}

const mapStateToProps = state => {
    return {
        accounts: state.accounts
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(CardListItem);
