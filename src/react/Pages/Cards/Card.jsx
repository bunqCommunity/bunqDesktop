import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Countdown from "react-countdown-now";

import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import Divider from "material-ui/Divider";
import List, { ListItem, ListSubheader, ListItemText } from "material-ui/List";
import Typography from "material-ui/Typography";
import { CircularProgress } from "material-ui/Progress";

import CardListItem from "./CardListItem";
import AccountListItem from "../../Components/AccountList/AccountListItem";
import TypographyTranslate from "../../Components/TranslationHelpers/Typography";
import ButtonTranslate from "../../Components/TranslationHelpers/Button";

import { cardUpdate } from "../../Actions/card";
import {
    cardUpdateCvc2Codes,
    cardCvc2CodesClear
} from "../../Actions/card_cvc2";

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
        marginTop: 20,
        height: 370
    },
    loadCvcbutton: {
        width: "100%"
    }
};

class Card extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            selectedCardIndex: 0,
            scrollDistance: 0,
            carouselStyle: {
                transform: "translateY(0px)"
            }
        };

        // improve render smoothness by using requestanimation frames
        this.ticking = false;

        window.onkeydown = this.handleKeyDown.bind(this);
        window.addEventListener("mousewheel", this.handleScroll.bind(this));
    }

    componentDidMount() {
        this.props.cardUpdate(this.props.user.id);
    }

    componentWillUnmount() {
        // remove event listeners
        window.onkeydown = null;
        window.removeEventListener("mousewheel", this.handleScroll.bind(this));
    }

    handleScroll = event => {
        if (!this.ticking) {
            window.requestAnimationFrame(() => {
                this.ticking = false;
                if (event.wheelDelta > 0) {
                    this.goPreviousCard();
                } else {
                    const filteredCards = this.props.cards.filter(card => {
                        return !(
                            card.CardDebit && card.CardDebit.status !== "ACTIVE"
                        );
                    });

                    this.goNextCard(filteredCards);
                }
            });
            this.ticking = true;
        }
    };

    cardUpdateCvc2Codes = event => {
        const cardInfo = this.props.cards[this.state.selectedCardIndex];
        this.props.cardUpdateCvc2Codes(
            this.props.user.id,
            cardInfo.CardDebit.id
        );
    };

    handleKeyDown = event => {
        const filteredCards = this.props.cards.filter(card => {
            return !(card.CardDebit && card.CardDebit.status !== "ACTIVE");
        });

        if (event.which === 40) {
            this.goNextCard(filteredCards);
        }
        if (event.which === 38) {
            this.goPreviousCard();
        }
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

    handleCardClick = index => {
        this.setState({ selectedCardIndex: index });
    };

    countDownRenderer = ({ total, days, hours, minutes, seconds }) => {
        return `Expires in: ${minutes}:${seconds}`;
    };

    render() {
        const t = this.props.t;
        let filteredCards = [];
        let cards = [];

        if (this.props.cards !== false) {
            // first filter the cards
            filteredCards = this.props.cards.filter(card => {
                return !(card.CardDebit && card.CardDebit.status !== "ACTIVE");
            });
            // then generate the items seperately
            cards = filteredCards.map((card, index) => (
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
                        <TypographyTranslate
                            variant="display1"
                            style={{ textAlign: "center" }}
                        >
                            Loading cards
                        </TypographyTranslate>
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
                        <TypographyTranslate
                            variant="display1"
                            style={{ textAlign: "center" }}
                        >
                            You don't have any cards
                        </TypographyTranslate>
                    </Grid>
                </Grid>
            );
        }

        const cardInfo = filteredCards[this.state.selectedCardIndex].CardDebit;
        const translateOffset = this.state.selectedCardIndex * 410;
        const carouselTranslate = "translateY(-" + translateOffset + "px)";

        // account connected to the currently selected card
        const connectedAccounts = cardInfo.pin_code_assignment.map(
            assignment => {
                // try to find the connected accoutn by ID
                const currentAccount = this.props.accounts.find(
                    account => account.id == assignment.monetary_account_id
                );

                let connectedText = "";
                switch (assignment.type) {
                    case "PRIMARY":
                        connectedText = t("Primary card");
                        break;
                    case "SECONDARY":
                        connectedText = t("Secondary card");
                        break;
                }

                // return the accout item for this account
                return (
                    <React.Fragment>
                        <ListSubheader style={{ height: 28 }}>
                            {connectedText}
                        </ListSubheader>
                        {!currentAccount ? (
                            <ListItem divider>
                                <ListItemText
                                    primary={t(
                                        "No account found for this card"
                                    )}
                                    secondary={t(
                                        "This likely means this card is connected to a Joint account"
                                    )}
                                />
                            </ListItem>
                        ) : (
                            <AccountListItem
                                BunqJSClient={this.props.BunqJSClient}
                                clickable={false}
                                account={currentAccount}
                            />
                        )}
                    </React.Fragment>
                );
            }
        );

        let displayCvcInfo = null;
        if (cardInfo.type === "MASTERCARD") {
            // if id is different but not null we don't show the cvc list
            const idsSet =
                this.props.cvcCardId === cardInfo.id &&
                this.props.cvcCardId !== null;

            let cvc2CodeList = null;
            if (idsSet) {
                cvc2CodeList =
                    this.props.cvc2Codes.length > 0 ? (
                        <List>
                            {this.props.cvc2Codes.map(cvc2_code => {
                                const timeMs =
                                    cvc2_code.expiry_time.getTime() + 3600000;
                                return (
                                    <ListItem>
                                        <ListItemText
                                            primary={`CVC: ${cvc2_code.cvc2}`}
                                            secondary={
                                                <Countdown
                                                    date={timeMs}
                                                    onComplete={
                                                        this.props
                                                            .cardCvc2CodesClear
                                                    }
                                                    renderer={
                                                        this.countDownRenderer
                                                    }
                                                />
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    ) : (
                        <TypographyTranslate
                            variant="body2"
                            style={{ textAlign: "center" }}
                        >
                            No CVC codes available
                        </TypographyTranslate>
                    );
            }

            displayCvcInfo = (
                <React.Fragment>
                    {cvc2CodeList}
                    <Button
                        style={styles.loadCvcbutton}
                        onClick={this.cardUpdateCvc2Codes}
                        disabled={this.props.cvcLoading}
                    >
                        {cvc2CodeList !== null ? (
                            t("Update CVC Codes")
                        ) : (
                            t("View CVC Codes")
                        )}
                    </Button>
                    <TypographyTranslate
                        variant="caption"
                        style={{ textAlign: "center" }}
                    >
                        This does not create new codes yet!
                    </TypographyTranslate>
                </React.Fragment>
            );
        }

        let second_line = cardInfo.second_line;
        if (
            second_line.length === 0 &&
            cardInfo.type === "MAESTRO_MOBILE_NFC"
        ) {
            second_line = "Apple Pay";
        }

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
                                <Grid container spacing={16}>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant={"title"}>
                                            {cardInfo.name_on_card}
                                        </Typography>
                                        <Typography variant={"subheading"}>
                                            {second_line}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography
                                            variant={"body2"}
                                            style={{ textAlign: "right" }}
                                        >
                                            {t("Expires")}: <br />
                                            {cardInfo.expiry_date}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                <br />
                                <List dense>
                                    <Divider />
                                    {connectedAccounts}
                                </List>

                                {displayCvcInfo}
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
        accounts: state.accounts.accounts,
        cards: state.cards.cards,
        cardsLoading: state.cards.loading,

        cvcLoading: state.card_cvc2.loading,
        cvcCardId: state.card_cvc2.card_id,
        cvcUserId: state.card_cvc2.user_id,
        cvc2Codes: state.card_cvc2.cvc2_codes
    };
};

const mapDispatchToProps = (dispatch, props) => {
    const { BunqJSClient } = props;
    return {
        cardUpdate: userId => dispatch(cardUpdate(BunqJSClient, userId)),
        // list all cvc2 codes
        cardUpdateCvc2Codes: (userId, cardId) =>
            dispatch(cardUpdateCvc2Codes(BunqJSClient, userId, cardId)),
        cardCvc2CodesClear: () => dispatch(cardCvc2CodesClear())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    translate("translations")(Card)
);
