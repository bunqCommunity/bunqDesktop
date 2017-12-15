import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Collapse from "material-ui/transitions/Collapse";
import IconButton from "material-ui/IconButton";
import CloseIcon from "material-ui-icons/Close";
import AddIcon from "material-ui-icons/Add";
import List, {
    ListItemText,
    ListItem,
    ListItemSecondaryAction
} from "material-ui/List";

import { cardUpdate } from "../Actions/card";
import CardListItem from "../Components/ListItems/CardListItem";

const styles = {
    paper: {
        marginBottom: 20
    },
    paper: {
        marginBottom: 20
    }
};

class Card extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            showForm: false
        };
    }

	checkUpdateRequirement = (props = this.props) => {
        const {
            user,
			cards
        } = props;
		
        this.props.cardUpdate(this.props.user.id);
		this.setState({ fetchedCards: true });
    }
	
	componentDidMount() {
        this.checkUpdateRequirement();
    }

	
    updateCards = () => {
        this.props.cardUpdate(this.props.user.id);
    };

    toggleForm = () => this.setState({ showForm: !this.state.showForm });

    render() {
		let cards = [];
        if (this.props.cards !== false) {
            cards = this.props.cards
                .filter(card => {
                    if (
                        card.CardDebit &&
                        card.CardDebit.status !== "ACTIVE"
                    ) {
                        return false;
                    }
                    return true;
                })
                .map(card => (
                    <CardListItem
                        BunqJSClient={this.props.BunqJSClient}
                        updateExternal={this.updateExternal}
                        card={card.CardDebit}
                    />
                ));
        }

        return (
                <List elevation={3}>{cards}</List>
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
    const { BunqJSClient } = props;
    return {
        cardUpdate: (userId) =>
            dispatch(cardUpdate(BunqJSClient, userId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);
