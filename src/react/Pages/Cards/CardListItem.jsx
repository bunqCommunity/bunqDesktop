import React from "react";
import { connect } from "react-redux";

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
        let cardImage = null;
        let cardType = null;
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

        return [
            <div className="single-card" style={styles.cardWrapper} onClick={this.props.onClick}>
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CardListItem);
