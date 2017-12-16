import React from "react";
import {connect} from "react-redux";

import {cardUpdate} from "../Actions/card";
import CardListItem from "../Components/ListItems/CardListItem";

import {Grid, Card as MaterialCard} from 'material-ui'

class Card extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showForm: false,
            carouselStyle: {
                transform: 'translateY(10vh)',
            }
        };
    }

    checkUpdateRequirement = (props = this.props) => {
        const {
            user,
            cards
        } = props;

        this.props.cardUpdate(this.props.user.id);
        this.setState({fetchedCards: true});
    }

    componentDidMount() {
        this.checkUpdateRequirement();
    }


    updateCards = () => {
        this.props.cardUpdate(this.props.user.id);
    };


    handleCardClick = (index) => {
        console.log(index);

        let offset = index * 40;
        let property = 'translateY(-' + offset + '%)';

        if (index === 0) {
            property = 'translateY(5%)';
        }

        this.setState({carouselStyle: {transform: property}})
    };

    toggleForm = () => this.setState({showForm: !this.state.showForm});

    render() {
        let cards = [];
        if (this.props.cards !== false) {
            cards = this.props.cards
                .filter(card => {
                    return !(card.CardDebit &&
                        card.CardDebit.status !== "ACTIVE");
                })
                .map((card, index) => (
                    <CardListItem
                        BunqJSClient={this.props.BunqJSClient}
                        updateExternal={this.updateExternal}
                        card={card.CardDebit}
                        index={index}
                        onClick={this.handleCardClick.bind(this, index)}
                    />
                ));
        }

        return (
            <Grid container spacing={24}>
                <Grid xs={6}>
                    <ul
                        className="carousel"
                        style={this.state.carouselStyle}
                    >
                        {cards}
                    </ul>
                </Grid>

                <Grid xs={6} className={'card-details-card'}>
                    <MaterialCard className={'card-details'}>
                        Card info here!
                    </MaterialCard>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        cards: state.cards.cards,
        cardsCardId: state.cards.selectedAccount,
        cardsLoading: state.cards.loading
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const {BunqJSClient} = props;
    return {
        cardUpdate: (userId) => dispatch(cardUpdate(BunqJSClient, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
