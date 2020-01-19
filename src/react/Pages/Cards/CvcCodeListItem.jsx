import React from "react";
import { connect } from "react-redux";
import Divider from "@material-ui/core/Divider";
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";

import RefreshIcon from "@material-ui/icons/Refresh";
import VisibilityIcon from "@material-ui/icons/Visibility";

import { cardGenerateCvc2, cardUpdateCvc2Codes } from "../../Actions/card_cvc2";

class CvcCodeListItem extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    updateCardCvc = () => {
        const { card, user } = this.props;

        this.props.cardUpdateCvc2Codes(user.id, card.id);
    };
    cardGenerateCvc2 = () => {
        const { card, user } = this.props;

        this.props.cardGenerateCvc2(user.id, card.id);
    };

    render() {
        const { t, card, user, cvcCodesCardId, cvcCodes, cvcCodesLoading, limitedPermissions } = this.props;

        if (limitedPermissions) return null;

        const validCardTypes = ["MASTERCARD", "MASTERCARD_VIRTUAL"];
        if (!validCardTypes.includes(card.type)) return null;

        let cvcCode = t("Hidden");
        if (card.id === cvcCodesCardId && cvcCodes.length > 0) {
            cvcCode = cvcCodes
                .map(cvcCode => {
                    return cvcCode.cvc2;
                })
                .join(", ");
        }

        return (
            <React.Fragment>
                <Divider />
                <ListItem>
                    <ListItemText secondary={t("CVC Code")} primary={cvcCode} />

                    <ListItemSecondaryAction>
                        <IconButton aria-label="View" onClick={this.updateCardCvc} disabled={cvcCodesLoading}>
                            <VisibilityIcon />
                        </IconButton>
                        <IconButton aria-label="Refresh" onClick={this.cardGenerateCvc2} disabled={cvcCodesLoading}>
                            <RefreshIcon />
                        </IconButton>
                    </ListItemSecondaryAction>
                </ListItem>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        cvcCodes: state.card_cvc2.cvc2_codes,
        cvcCodesCardId: state.card_cvc2.card_id,
        cvcCodesLoading: state.card_cvc2.loading,

        limitedPermissions: state.user.limited_permissions
    };
};

const mapDispatchToProps = dispatch => {
    return {
        cardUpdateCvc2Codes: (userId, cardId) => dispatch(cardUpdateCvc2Codes(userId, cardId)),
        cardGenerateCvc2: (userId, cardId) => dispatch(cardGenerateCvc2(userId, cardId))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(CvcCodeListItem);
