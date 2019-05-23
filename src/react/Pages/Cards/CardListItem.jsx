import React from "react";

const styles = {
    cardWrapper: {},
    card: {},
    details: {},
    content: {},
    cover: {},
    cardImage: {}
};

export const getCardTypeImage = (type, apiType = "CardDebit") => {
    let cardImage = null;
    let cardType = null;
    switch (type) {
        case "MASTERCARD": {
            switch (apiType) {
                case "CardCredit":
                    cardType = "MasterCard Credit";
                    cardImage = "images/bunq-mastercard-credit.png";
                    break;
                default:
                case "CardDebit":
                    cardType = "MasterCard Debit";
                    cardImage = "images/bunq-mastercard.png";
                    break;
            }
            break;
        }
        case "MASTERCARD_VIRTUAL":
            cardType = "Virtual MasterCard";
            cardImage = "images/bunq-mastercard-virtual.svg";
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
    return { cardImage, cardType };
};

class CardListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    render() {
        const card = this.props.card;
        const { cardImage } = getCardTypeImage(card.type, card.cardType);

        return [
            <div className="single-card" style={styles.cardWrapper} onClick={this.props.onClick}>
                <img className="card-image" src={cardImage} />
            </div>
        ];
    }
}

export default CardListItem;
