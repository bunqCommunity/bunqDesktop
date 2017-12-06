import React from "react";
import { connect } from "react-redux";
import { withTheme } from "material-ui/styles";
import Helmet from "react-helmet";
import Redirect from "react-router-dom/Redirect";
import Grid from "material-ui/Grid";
import Paper from "material-ui/Paper";
import Button from "material-ui/Button";
import List, { ListItem, ListItemText } from "material-ui/List";
import Divider from "material-ui/Divider";
import ArrowBackIcon from "material-ui-icons/ArrowBack";
import CircularProgress from "material-ui/Progress/CircularProgress";
import Typography from "material-ui/Typography";

import { formatMoney, humanReadableDate } from "../Helpers/Utils";
import {
    masterCardActionText,
    masterCardActionParser
} from "../Helpers/StatusTexts";
import TransactionHeader from "../Components/TransactionHeader";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";

import { masterCardActionInfoUpdate } from "../Actions/master_card_action_info";

const styles = {
    btn: {},
    paper: {
        padding: 24
    },
    list: {
        textAlign: "left"
    },
    textCenter: {
        textAlign: "center"
    }
};

class MasterCardActionInfo extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    componentDidMount() {
        if (this.props.initialBunqConnect) {
            const { masterCardActionId, accountId } = this.props.match.params;
            this.props.masterCardActionInfoUpdate(
                this.props.user.id,
                accountId === undefined
                    ? this.props.accountsSelectedAccount
                    : accountId,
                masterCardActionId
            );
        }
    }

    componentWillUpdate(nextProps, nextState) {
        if (
            this.props.initialBunqConnect &&
            this.props.match.params.masterCardActionId !==
                nextProps.match.params.masterCardActionId
        ) {
            const { masterCardActionId, accountId } = nextProps.match.params;
            this.props.masterCardActionInfoUpdate(
                nextProps.user.id,
                accountId === undefined
                    ? nextProps.accountsSelectedAccount
                    : accountId,
                masterCardActionId
            );
        }
    }

    render() {
        const {
            accountsSelectedAccount,
            masterCardActionInfo,
            masterCardActionLoading,
            theme
        } = this.props;
        const paramAccountId = this.props.match.params.accountId;

        // we require a selected account before we can display payment information
        if (accountsSelectedAccount === false && paramAccountId !== undefined) {
            // no account_id set
            return <Redirect to={"/"} />;
        }

        let content;
        if (
            masterCardActionInfo === false ||
            masterCardActionLoading === true
        ) {
            content = (
                <Grid container spacing={24} justify={"center"}>
                    <Grid item xs={12}>
                        <div style={{ textAlign: "center" }}>
                            <CircularProgress />
                        </div>
                    </Grid>
                </Grid>
            );
        } else {
            const masterCardAction = masterCardActionInfo[0].MasterCardAction;
            const paymentAmount = masterCardAction.amount_local.value;
            const paymentDate = humanReadableDate(masterCardAction.created);
            const formattedPaymentAmount = formatMoney(paymentAmount);
            const paymentLabel = masterCardActionText(masterCardAction);

            content = (
                <Grid
                    container
                    spacing={24}
                    align={"center"}
                    justify={"center"}
                >
                    <TransactionHeader
                        BunqJSClient={this.props.BunqJSClient}
                        to={masterCardAction.counterparty_alias}
                        from={masterCardAction.alias}
                        swap={paymentAmount > 0}
                    />

                    <Grid item xs={12}>
                        <MoneyAmountLabel
                            component={"h1"}
                            style={{ textAlign: "center" }}
                            info={masterCardAction}
                            type="masterCardAction"
                        >
                            {formattedPaymentAmount}
                        </MoneyAmountLabel>

                        <Typography
                            style={{ textAlign: "center" }}
                            type={"body1"}
                        >
                            {paymentLabel}
                        </Typography>

                        <List style={styles.list}>
                            {masterCardAction.description.length > 0 ? (
                                [
                                    <Divider />,
                                    <ListItem>
                                        <ListItemText
                                            primary={"Description"}
                                            secondary={
                                                masterCardAction.description
                                            }
                                        />
                                    </ListItem>
                                ]
                            ) : null}

                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"Date"}
                                    secondary={paymentDate}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"Payment Type"}
                                    secondary={masterCardActionParser(
                                        masterCardAction.pan_entry_mode_user
                                    )}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"Card"}
                                    secondary={
                                        masterCardAction.label_card.second_line
                                    }
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"Authorisation Type"}
                                    secondary={
                                        masterCardAction.authorisation_type
                                    }
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={"Authorisation Status"}
                                    secondary={
                                        masterCardAction.authorisation_status
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </List>
                    </Grid>
                </Grid>
            );
        }

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - Mastercard Info`}</title>
                </Helmet>

                <Grid item xs={12} sm={2}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Paper style={styles.paper}>{content}</Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        masterCardActionInfo:
            state.master_card_action_info.master_card_action_info,
        masterCardActionLoading: state.master_card_action_info.loading,
        accountsSelectedAccount: state.accounts.selectedAccount
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { BunqJSClient } = ownProps;
    return {
        masterCardActionInfoUpdate: (
            user_id,
            account_id,
            master_card_action_id
        ) =>
            dispatch(
                masterCardActionInfoUpdate(
                    BunqJSClient,
                    user_id,
                    account_id,
                    master_card_action_id
                )
            )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(
    withTheme()(MasterCardActionInfo)
);
