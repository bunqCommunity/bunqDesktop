import React from "react";
import { connect } from "react-redux";
import { translate } from "react-i18next";
import Countdown from "react-countdown-now";

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
import TypographyTranslate from "../../Components/TranslationHelpers/Typography";

import { cardUpdate } from "../../Actions/card";
import { cardUpdateCvc2Codes, cardCvc2CodesClear } from "../../Actions/card_cvc2";

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
        // height: 370
    },
    loadCvcbutton: {
        width: "100%"
    },
    activityButton: {
        position: "fixed",
        top: 60,
        right: 8,
        zIndex: 2
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
            },

            displayInactive: false
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

    filterCards = card => {
        // ignore filter if enabled
        if (this.state.displayInactive) return true;

        // filter if not active
        return !(card.CardDebit && card.CardDebit.status !== "ACTIVE");
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

    cardUpdateCvc2Codes = event => {
        const cardInfo = this.props.cards[this.state.selectedCardIndex];
        this.props.cardUpdateCvc2Codes(this.props.user.id, cardInfo.CardDebit.id);
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

    toggleInactiveCards = e => {
        this.setState({
            displayInactive: !this.state.displayInactive,
            selectedCardIndex: 0
        });
    };

    countDownRenderer = ({ total, days, hours, minutes, seconds }) => {
        return `Expires in: ${minutes}:${seconds}`;
    };

    getCardStatus = cardInfo => {
        const t = this.props.t;

        const ACTIVE = t("Active");
        const DEACTIVATED = t("Deactivated");
        const LOST = t("Lost");
        const STOLEN = t("Stolen");
        const CANCELLED = t("Cancelled");

        switch (cardInfo.status) {
            case "ACTIVE":
                return ACTIVE;
            case "DEACTIVATED":
                return DEACTIVATED;
            case "LOST":
                return LOST;
            case "STOLEN":
                return STOLEN;
            case "CANCELLED":
                return CANCELLED;
        }

        return cardInfo.status;
    };
    getCardOrderStatus = cardInfo => {
        const t = this.props.t;

        const VIRTUAL_DELIVERY = t("Delivered virtually");
        const NEW_CARD_REQUEST_RECEIVED = t("New card request received");
        const ACCEPTED_FOR_PRODUCTION = t("Accepted for production");
        const DELIVERED_TO_CUSTOMER = t("Delivered to customer");
        const CARD_UPDATE_REQUESTED = t("Card update requested");
        const CARD_UPDATE_SENT = t("Card update sent");
        const CARD_UPDATE_ACCEPTED = t("Card update accepted");

        switch (cardInfo.order_status) {
            case "VIRTUAL_DELIVERY":
                return `${VIRTUAL_DELIVERY} (VIRTUAL_DELIVERY)`;
            case "ACCEPTED_FOR_PRODUCTION":
                return `${ACCEPTED_FOR_PRODUCTION} (ACCEPTED_FOR_PRODUCTION)`;
            case "NEW_CARD_REQUEST_RECEIVED":
                return `${NEW_CARD_REQUEST_RECEIVED} (NEW_CARD_REQUEST_RECEIVED)`;
            case "DELIVERED_TO_CUSTOMER":
                return `${DELIVERED_TO_CUSTOMER} (DELIVERED_TO_CUSTOMER)`;
            case "CARD_UPDATE_REQUESTED":
                return `${CARD_UPDATE_REQUESTED} (CARD_UPDATE_REQUESTED)`;
            case "CARD_UPDATE_SENT":
                return `${CARD_UPDATE_SENT} (CARD_UPDATE_SENT)`;
            case "CARD_UPDATE_ACCEPTED":
                return `${CARD_UPDATE_ACCEPTED} (CARD_UPDATE_ACCEPTED)`;
        }

        return cardInfo.order_status;
    };

    render() {
        const t = this.props.t;
        let filteredCards = [];
        let cards = [];

        if (this.props.cards !== false) {
            // first filter the cards
            filteredCards = this.props.cards.filter(this.filterCards);
            // then generate the items seperately
            cards = filteredCards
                .filter(this.filterCards)
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
                <Grid container spacing={24} style={styles.gridContainer} justify="center" alignItems="center">
                    <Grid item xs={12} style={{ textAlign: "center" }}>
                        <CircularProgress size={75} />
                        <TypographyTranslate variant="h4" style={{ textAlign: "center" }}>
                            Loading cards
                        </TypographyTranslate>
                    </Grid>
                </Grid>
            );
        }

        if (cards.length === 0) {
            return (
                <Grid container spacing={24} style={styles.gridContainer} justify="center" alignItems="center">
                    <Grid item xs={12}>
                        <TypographyTranslate variant="h4" style={{ textAlign: "center" }}>
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

        let displayCvcInfo = null;
        if (cardInfo.type === "MASTERCARD" && cardInfo.status === "ACTIVE") {
            // if id is different but not null we don't show the cvc list
            const idsSet = this.props.cvcCardId === cardInfo.id && this.props.cvcCardId !== null;

            let cvc2CodeList = null;
            if (idsSet) {
                cvc2CodeList =
                    this.props.cvc2Codes.length > 0 ? (
                        <List>
                            {this.props.cvc2Codes.map(cvc2_code => {
                                const timeMs = cvc2_code.expiry_time.getTime() + 3600000;
                                return (
                                    <ListItem>
                                        <ListItemText
                                            primary={`CVC: ${cvc2_code.cvc2}`}
                                            secondary={
                                                <Countdown
                                                    date={timeMs}
                                                    onComplete={this.props.cardCvc2CodesClear}
                                                    renderer={this.countDownRenderer}
                                                />
                                            }
                                        />
                                    </ListItem>
                                );
                            })}
                        </List>
                    ) : (
                        <TypographyTranslate variant="body2" style={{ textAlign: "center" }}>
                            No CVC codes available
                        </TypographyTranslate>
                    );
            }

            // displayCvcInfo = (
            //     <React.Fragment>
            //         {cvc2CodeList}
            //         <Button
            //             style={styles.loadCvcbutton}
            //             onClick={this.cardUpdateCvc2Codes}
            //             disabled={this.props.cvcLoading}
            //         >
            //             {cvc2CodeList !== null
            //                 ? t("Update CVC Codes")
            //                 : t("View CVC Codes")}
            //         </Button>
            //         <TypographyTranslate
            //             variant="caption"
            //             style={{ textAlign: "center" }}
            //         >
            //             This does not create new codes yet!
            //         </TypographyTranslate>
            //     </React.Fragment>
            // );
        }

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
                        {cards}
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
                                        <ListItemText
                                            primary={t("Card status")}
                                            secondary={this.getCardStatus(cardInfo)}
                                        />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText primary={t("Country")} secondary={cardInfo.country} />
                                    </ListItem>
                                    <Divider />
                                    <ListItem>
                                        <ListItemText
                                            primary={t("Order status")}
                                            secondary={this.getCardOrderStatus(cardInfo)}
                                        />
                                    </ListItem>
                                </List>

                                {this.props.limitedPermissions ? null : displayCvcInfo}
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
        limitedPermissions: state.user.limited_permissions,

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
        cardUpdateCvc2Codes: (userId, cardId) => dispatch(cardUpdateCvc2Codes(BunqJSClient, userId, cardId)),
        cardCvc2CodesClear: () => dispatch(cardCvc2CodesClear())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(translate("translations")(Card));
