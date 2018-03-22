import React from "react";
import { connect } from "react-redux";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Typography from "material-ui/Typography";
import { CircularProgress } from "material-ui/Progress";

import { cardUpdate } from "../../Actions/card";
import CardListItem from "./CardListItem";

const styles = {
    gridContainer: {
        height: "calc(96vh - 50px)",
        overflow: "hidden"
    },
    cardInfoContainer: {
        // height: "100%",
        marginTop: "calc(6vh + 20px)"
    },
    cardInfoPaper: {
        marginTop: 30,
        height: 350
    }
};

class Card extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedCardIndex: 0,
            carouselStyle: {
                transform: "translateY(0px)"
            }
        };
    }

    componentDidMount() {
        this.props.cardUpdate(this.props.user.id);
    }

    handleCardClick = index => {
        this.setState({ selectedCardIndex: index });
    };

    render() {
        let cards = [];
        if (this.props.cards !== false) {
            cards = this.props.cards
                .filter(card => {
                    return !(
                        card.CardDebit && card.CardDebit.status !== "ACTIVE"
                    );
                })
                .map((card, index) => (
                    <CardListItem
                        BunqJSClient={this.props.BunqJSClient}
                        card={card.CardDebit}
                        onClick={this.handleCardClick.bind(this, index)}
                    />
                ));
        }

        if (this.props.cardsLoading) {
            return (
                <Grid
                    container
                    spacing={24}
                    style={styles.gridContainer}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <CircularProgress size={75} />
                        <Typography
                            variant="display1"
                            style={{ textAlign: "center" }}
                        >
                            Loading cards...
                        </Typography>
                    </Grid>
                </Grid>
            );
        }

        if (cards.length === 0) {
            return (
                <Grid
                    container
                    spacing={24}
                    style={styles.gridContainer}
                    justify="center"
                    alignItems="center"
                >
                    <Grid item xs={12}>
                        <Typography
                            variant="display1"
                            style={{ textAlign: "center" }}
                        >
                            You don't have any cards
                        </Typography>
                    </Grid>
                </Grid>
            );
        }

        const translateOffset = this.state.selectedCardIndex * 410;
        const carouselTranslate = "translateY(-" + translateOffset + "px)";

        return (
            <Grid container spacing={24} style={styles.gridContainer}>
                <Grid item xs={6}>
                    <ul
                        className="carousel"
                        style={{ transform: carouselTranslate }}
                    >
                        {cards}
                    </ul>
                </Grid>
                <Grid item xs={6}>
                    <Grid
                        container
                        spacing={24}
                        alignItems={"center"}
                        style={styles.cardInfoContainer}
                    >
                        <Grid item xs={12}>
                            <Paper style={styles.cardInfoPaper}>
                                Card info here!
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        cards: state.cards.cards,
        cardsLoading: state.cards.loading
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        cardUpdate: userId => dispatch(cardUpdate(BunqJSClient, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
