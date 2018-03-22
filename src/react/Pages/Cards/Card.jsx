import React from "react";
import { connect } from "react-redux";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Divider from "material-ui/Divider";
import List, { ListItem, ListItemText, ListSubheader } from "material-ui/List";
import Typography from "material-ui/Typography";
import { CircularProgress } from "material-ui/Progress";

import CardListItem from "./CardListItem";
import AccountListItem from "../../Components/AccountList/AccountListItem";

import { cardUpdate } from "../../Actions/card";

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
        padding: 12,
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

        const cardInfo = this.props.cards[this.state.selectedCardIndex]
            .CardDebit;
        const translateOffset = this.state.selectedCardIndex * 410;
        const carouselTranslate = "translateY(-" + translateOffset + "px)";

        // account connected to the currently selected card
        const connectedAccounts = cardInfo.pin_code_assignment.map(
            assignment => {
                // try to find the connected accoutn by ID
                const currentAccount = this.props.accounts.find(
                    account => account.id == assignment.monetary_account_id
                );

                if (!currentAccount) {
                    return null;
                    // TODO show that joint accounts aren't available yet
                    return <ListItem>Joint account</ListItem>;
                }

                let connectedText = "";
                switch (assignment.type) {
                    case "PRIMARY":
                        connectedText = "Primary card";
                        break;
                    case "SECONDARY":
                        connectedText = "Secondary card";
                        break;
                }

                // return the accout item for this account
                return (
                    <React.Fragment>
                        <ListSubheader style={{ height: 28 }}>
                            {connectedText}
                        </ListSubheader>
                        <AccountListItem
                            BunqJSClient={this.props.BunqJSClient}
                            clickable={false}
                            account={currentAccount}
                        />
                    </React.Fragment>
                );
            }
        );

        console.log("");
        console.log(cardInfo);

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
                                <Grid container>
                                    <Grid item xs={12} sm={6}>
                                        <Typography variant={"title"}>
                                            {cardInfo.name_on_card}
                                        </Typography>
                                        <Typography variant={"subheading"}>
                                            {cardInfo.second_line}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <Typography
                                            variant={"body2"}
                                            style={{ textAlign: "right" }}
                                        >
                                            {cardInfo.expiry_date}
                                        </Typography>
                                    </Grid>
                                </Grid>

                                {/*{cardInfo.primary_account_number_four_digit?*/}
                                {/*<Typography variant={"body2"}>*/}
                                {/*____-____-____-{cardInfo.primary_account_number_four_digit}*/}
                                {/*</Typography>: null}*/}

                                <br />
                                <List>
                                    <Divider />
                                    {connectedAccounts}
                                </List>
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
