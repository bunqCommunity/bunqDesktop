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
        marginBottom: 20
	},
	card: {
		display: 'flex',
		marginBottom: '10'
	},
	details: {
		flex: '2 0 0',
		flexDirection: 'column'
	},
	content: {
		flex: '1 0 auto'
	},
	cover: {
		flex: '1 0 0',
		width: 70,
		height: 70
	},
	cardImage: {
		height: 68,
		float: 'right',
        margin: 10
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
			<div style={styles.cardWrapper}>
				<Card style={styles.card}>
					<div style={styles.details}>
						<CardContent style={styles.content}>
							<Typography type="headline" component="h2">
								{cardType}
							</Typography>
							<Typography component="p">
								{card.second_line}
							</Typography>

							{cardType == "MasterCard" ? (
							<Typography component="p">
								Cardnumber: ******{card.primary_account_number_four_digit}
								<br/> (available in bunq app or on card)
							</Typography>
							) : null}

							<br/>
							<Typography component="p">
								Expiry date: {humanReadableDate(card.expiry_date,false)}
							</Typography>
							<Typography component="p">
								Connected account: {connectedAccountName} ({card.label_monetary_account_current.iban})
							</Typography>
						</CardContent>
					</div>
					<div style={styles.cover}>
						<img src={cardImage} style={styles.cardImage}/>
					</div>
				</Card>
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
