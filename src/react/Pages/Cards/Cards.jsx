import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import CircularProgress from "@material-ui/core/CircularProgress";

import CardListItem from "./CardListItem";
import AccountListItem from "../../Components/AccountList/AccountListItem";
import TranslateTypography from "../../Components/TranslationHelpers/Typography";

import { cardStatus, cardOrderStatus } from "../../Functions/EventStatusTexts";
import { cardsUpdate, cardsSetCardOrder } from "../../Actions/cards";

const styles = {
    gridContainer: {
        height: "calc(100vh - 50px)",
        overflow: "hidden"
    },
    cardInfoContainer: {
        marginTop: "calc(6vh + 20px)"
    },
    cardInfoPaper: {
        padding: 12,
        marginTop: 20
    },
    activityButton: {
        position: "fixed",
        top: 60,
        right: 8,
        zIndex: 2
    }
};

class Cards extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedCardIndex: 0,
            scrollDistance: 0,
            carouselStyle: {
                transform: "translateY(0px)"
            },

            displayInactive: false
        };

        // improve render smoothness by using requestanimation frames
        this.ticking = false;

        window.onkeydown = this.handleKeyDown.bind(this);
        window.addEventListener("mousewheel", this.handleScroll.bind(this));
    }

    componentDidMount() {
        this.props.cardsUpdate(this.props.user.id);
    }

    componentWillUnmount() {
        // remove event listeners
        window.onkeydown = null;
        window.removeEventListener("mousewheel", this.handleScroll.bind(this));
    }

    getCardsList = () => {
        return this.props.cards.filter(this.filterCards).sort(this.sortCards);
    };
    filterCards = card => {
        // ignore filter if enabled
        if (this.state.displayInactive) return true;

        // filter if not active
        return !(card.CardDebit && card.CardDebit.status !== "ACTIVE");
    };
    sortCards = (card1, card2) => {
        const card1OrderIndex = this.findCardOrderIndex(card1);
        const card2OrderIndex = this.findCardOrderIndex(card2);

        return card1OrderIndex > card2OrderIndex;
    };
    findCardOrderIndex = card => {
        return this.props.cardsOrder.findIndex(cardId => {
            return cardId === card.CardDebit.id;
        });
    };

    handleScroll = event => {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.ticking = false;
                if (event.wheelDelta > 0) {
                    this.goPreviousCard();
                } else {
                    const filteredCards = this.props.cards.filter(this.filterCards);

                    this.goNextCard(filteredCards);
                }
            });
            this.ticking = true;
        }
    };

    handleKeyDown = event => {
        const filteredCards = this.props.cards.filter(this.filterCards);

        if (event.which === 40) {
            this.goNextCard(filteredCards);
        }
        if (event.which === 38) {
            this.goPreviousCard();
        }
    };
    handleCardClick = index => {
        this.setState({ selectedCardIndex: index });
    };

    goNextCard = filteredCards => {
        if (this.state.selectedCardIndex < filteredCards.length - 1) {
            this.setState({
                selectedCardIndex: this.state.selectedCardIndex + 1
            });
        }
    };
    goPreviousCard = () => {
        if (this.state.selectedCardIndex > 0) {
            this.setState({
                selectedCardIndex: this.state.selectedCardIndex - 1
            });
        }
    };

    toggleInactiveCards = e => {
        this.setState({
            displayInactive: !this.state.displayInactive,
            selectedCardIndex: 0
        });
    };

    moveCardUp = e => {
        const index = this.state.selectedCardIndex;
        const cardsOrder = [...this.props.cardsOrder];
        const cards = this.getCardsList();

        const cardInfoAbove = cards[index - 1];
        if (cardInfoAbove) {
            const cardInfo = cards[index];

            const cardOrderAboveIndex = this.findCardOrderIndex(cardInfoAbove);
            const cardOrderIndex = this.findCardOrderIndex(cardInfo);

            // switch the indexes
            cardsOrder.splice(cardOrderAboveIndex, 1, cardInfo.CardDebit.id);
            cardsOrder.splice(cardOrderIndex, 1, cardInfoAbove.CardDebit.id);

            this.props.cardsSetCardOrder(cardsOrder);
            this.setState({
                selectedCardIndex: index - 1
            });
        }
    };
    moveCardDown = e => {
        const index = this.state.selectedCardIndex;
        const cardsOrder = [...this.props.cardsOrder];
        const cards = this.getCardsList();

        const cardInfoUnder = cards[index + 1];
        if (cardInfoUnder) {
            const cardInfo = cards[index];

            const cardOrderUnderIndex = this.findCardOrderIndex(cardInfoUnder);
            const cardOrderIndex = this.findCardOrderIndex(cardInfo);

            // switch the indexes
            cardsOrder.splice(cardOrderUnderIndex, 1, cardInfo.CardDebit.id);
            cardsOrder.splice(cardOrderIndex, 1, cardInfoUnder.CardDebit.id);

            this.props.cardsSetCardOrder(cardsOrder);
            this.setState({
                selectedCardIndex: index + 1
            });
        }
    };

    render() {
        const { t, cards } = this.props;
        const selectedCardIndex = this.state.selectedCardIndex;
        let cardItems = [];
        const filteredCards = this.getCardsList();

        if (this.props.cards !== false) {
            // then generate the items seperately
            cardItems = filteredCards.map((card, index) => (
                <CardListItem
                    BunqJSClient={this.props.BunqJSClient}
                    card={card.CardDebit}
                    onClick={this.handleCardClick.bind(this, index)}
                />
            ));
        }

        if (this.props.cardsLoading) {
            return (
                <Grid container spacing={24} style={styles.gridContainer} justify="center" alignItems="center">
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <CircularProgress size={75} />
                        <TranslateTypography variant="h4" style={{ textAlign: "center" }}>
                            Loading cards
                        </TranslateTypography>
                    </Grid>
                </Grid>
            );
        }

        if (filteredCards.length === 0) {
            return (
                <Grid container spacing={24} style={styles.gridContainer} justify="center" alignItems="center">
                    <Grid item xs={12}>
                        <TranslateTypography variant="h4" style={{ textAlign: "center" }}>
                            You don't have any cards
                        </TranslateTypography>
                    </Grid>
                </Grid>
            );
        }

        const cardInfo = filteredCards[selectedCardIndex].CardDebit;
        const translateOffset = selectedCardIndex * 410;
        const carouselTranslate = "translateY(-" + translateOffset + "px)";

        // account connected to the currently selected card
        const connectedAccounts = cardInfo.pin_code_assignment.map(assignment => {
            // try to find the connected accoutn by ID
            const currentAccount = this.props.accounts.find(account => account.id == assignment.monetary_account_id);

            let connectedText = "";
            switch (assignment.type) {
                case "PRIMARY":
                    connectedText = t("Primary account");
                    break;
                case "SECONDARY":
                    connectedText = t("Secondary account");
                    break;
            }

            // return the accout item for this account
            return (
                <React.Fragment>
                    <ListSubheader style={{ height: 28, marginBottom: 8 }}>{connectedText}</ListSubheader>
                    {!currentAccount ? null : (
                        <AccountListItem
                            BunqJSClient={this.props.BunqJSClient}
                            clickable={false}
                            account={currentAccount}
                        />
                    )}
                </React.Fragment>
            );
        });

        let second_line = cardInfo.second_line;
        if (second_line.length === 0 && cardInfo.type === "MAESTRO_MOBILE_NFC") {
            second_line = "Apple Pay";
        }

        return (
            <Grid container spacing={24} style={styles.gridContainer}>
                <Button style={styles.activityButton} onClick={this.toggleInactiveCards}>
                    {this.state.displayInactive ? t("Hide inactive cards") : t("Display inactive cards")}
                </Button>

                <Grid item xs={6} className="animated fadeInLeft">
                    <ul className="carousel" style={{ transform: carouselTranslate }}>
                        {cardItems}
                    </ul>
                </Grid>
                <Grid item xs={6} className="animated fadeInRight">
                    <Grid container spacing={24} alignItems={"center"} style={styles.cardInfoContainer}>
                        <Grid item xs={12}>
                            <Paper style={styles.cardInfoPaper}>
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="h6">{cardInfo.name_on_card}</Typography>
                                        <Typography variant="subtitle1">{second_line}</Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant="body1" style={{ textAlign: "right" }}>
                                            {t("Expires")}: <br />
                                            {cardInfo.expiry_date}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <br />
                                <List dense>
                                    <Divider />
                                    {connectedAccounts}

                                    <ListItem>
                                        <ListItemText primary={t("Cards status")} secondary={cardStatus(cardInfo, t)} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={t("Country")} secondary={cardInfo.country} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText
                                            primary={t("Order status")}
                                            secondary={cardOrderStatus(cardInfo, t)}
                                        />
                                    </ListItem>
                                </List>
                            </Paper>
                        </Grid>
                        <Grid item xs={12}>
                            <Button disabled={selectedCardIndex === 0} onClick={this.moveCardUp}>
                                Move up
                            </Button>
                            <Button
                                disabled={selectedCardIndex === filteredCards.length - 1}
                                onClick={this.moveCardDown}
                            >
                                Move down
                            </Button>
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
        limitedPermissions: state.user.limited_permissions,

        accounts: state.accounts.accounts,
        cards: state.cards.cards,
        cardsOrder: state.cards.card_order,
        cardsLoading: state.cards.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {
        cardsUpdate: userId => dispatch(cardsUpdate(userId)),
        cardsSetCardOrder: cardOrder => dispatch(cardsSetCardOrder(cardOrder))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(Cards));
