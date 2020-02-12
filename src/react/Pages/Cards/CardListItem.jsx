import React from "react";

const styles = {
    cardWrapper: {},
    card: {},
    details: {},
    content: {},
    cover: {},
    cardImage: {}
};

export const getCardTypeImage = card => {
    const type = card.type;
    const productType = card.product_type;
    let cardType = card.cardType;

    let cardImage = null;
    switch (type) {
        case "MASTERCARD": {
            // check the different physical mastercard types
            switch (cardType) {
                case "CardCredit":
                    // check the different credit card types
                    switch (productType) {
                        case "MASTERCARD_GREEN":
                            if (card.founder_number) {
                                cardType = "MasterCard Green Founder's Edition";
                                cardImage = "images/bunq-mastercard-metal-founders.png";
                            } else {
                                cardType = "MasterCard Green";
                                cardImage = "images/bunq-mastercard-metal.png";
                            }

                            break;
                        default:
                        case "MASTERCARD_TRAVEL":
                            cardType = "MasterCard Credit";
                            cardImage = "images/bunq-mastercard-credit.png";
                            break;
                    }
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
        const { cardImage } = getCardTypeImage(card);

        return [
            <div className="single-card" style={styles.cardWrapper} onClick={this.props.onClick}>
                <img className="card-image" src={cardImage} />
            </div>
        ];
    }
}

export default CardListItem;
