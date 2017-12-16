import React from "react";
import { connect } from "react-redux";

import Card, { CardContent, CardMedia } from 'material-ui/Card';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

import NavLink from "../../Components/Routing/NavLink";
import { formatMoney, humanReadableDate } from "../../Helpers/Utils";

import store from "store";

const styles = {
	cardWrapper: {
	},
	card: {
	},
	details: {
	},
	content: {
	},
	cover: {
	},
	cardImage: {
	}
};

class CardListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const card = this.props.card;
		const accounts = this.props.accounts;
		
		let cardImage = null;
        let cardType = null;
		let connectedAccountName = null;
        switch (card.type) {
            case "MASTERCARD":
                cardType = "MasterCard";
                cardImage = "images/mastercard_logo.png";
                break;
            case "MAESTRO":
                cardType = "Maestro";
                cardImage = "images/maestro_logo.png";
                break;
            case "MAESTRO_MOBILE_NFC":
                cardType = "Mobile NFC";
                cardImage = "images/contactless_icon.png";
                break;
            default:
                cardType = "Unknown";
                cardImage = "images/maestro_logo.png";
                break;
        }
		
		connectedAccountName = accounts.accounts.find(account => account.MonetaryAccountBank.id == card.pin_code_assignment[0].monetary_account_id).MonetaryAccountBank.description;
		
        if (card.status !== "ACTIVE") {
            return null;
        }

        return [
			<div
                className="single-card"
                style={styles.cardWrapper}
                onClick={this.props.onClick}
            >
                <img src='images/bunq-mastercard.png' />
            </div>
        ];
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
		accounts: state.accounts,
        cardsLoading: state.cards.loading,
        cardsCardId: state.cards.selectedCard
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        selectCard: cardId => dispatch(cardsSelectCard(cardId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CardListItem);
