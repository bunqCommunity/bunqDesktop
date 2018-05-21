import React from "react";
import { translate } from "react-i18next";
import { connect } from "react-redux";
import { withTheme } from "@material-ui/core/styles";
import Helmet from "react-helmet";
import Redirect from "react-router-dom/Redirect";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";

import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import HelpIcon from "@material-ui/icons/Help";
import BookmarkIcon from "@material-ui/icons/Bookmark";

import ExportDialog from "../Components/ExportDialog";
import SpeedDial from "../Components/SpeedDial";
import TransactionHeader from "../Components/TransactionHeader";
import MoneyAmountLabel from "../Components/MoneyAmountLabel";
import CategorySelectorDialog from "../Components/Categories/CategorySelectorDialog";
import CategoryChips from "../Components/Categories/CategoryChips";

import { formatMoney, humanReadableDate } from "../Helpers/Utils";
import {
    masterCardActionText,
    masterCardActionParser
} from "../Helpers/StatusTexts";
import { masterCardActionInfoUpdate } from "../Actions/master_card_action_info";
import ArrowUpIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownIcon from "@material-ui/icons/ArrowDownward";

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
        this.state = {
            displayExport: false,
            displayCategories: false
        };
    }

    componentDidMount() {
        if (
            this.props.initialBunqConnect &&
            this.props.user &&
            this.props.user.id
        ) {
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
            nextProps.user &&
            nextProps.user.id &&
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

    toggleCategoryDialog = event =>
        this.setState({ displayCategories: !this.state.displayCategories });

    render() {
        const {
            accountsSelectedAccount,
            masterCardActionInfo,
            masterCardActionLoading,
            theme,
            t
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
            const masterCardAction = masterCardActionInfo;
            const paymentAmount = masterCardAction.getAmount();
            const paymentDate = humanReadableDate(masterCardAction.created);
            const formattedPaymentAmount = formatMoney(paymentAmount);
            const paymentLabel = masterCardActionText(masterCardAction, t);

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
                        accounts={this.props.accounts}
                        user={this.props.user}
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
                            variant={"body1"}
                        >
                            {paymentLabel}
                        </Typography>

                        <List style={styles.list}>
                            {masterCardAction.description.length > 0 ? (
                                [
                                    <Divider />,
                                    <ListItem>
                                        <ListItemText
                                            primary={t("Description")}
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
                                    primary={t("Date")}
                                    secondary={paymentDate}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={t("Payment Type")}
                                    secondary={masterCardActionParser(
                                        masterCardAction,
                                        t
                                    )}
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={t("Card")}
                                    secondary={
                                        masterCardAction.label_card.second_line
                                    }
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={t("Authorisation Type")}
                                    secondary={
                                        masterCardAction.authorisation_type
                                    }
                                />
                            </ListItem>
                            <Divider />
                            <ListItem>
                                <ListItemText
                                    primary={t("Authorisation Status")}
                                    secondary={
                                        masterCardAction.authorisation_status
                                    }
                                />
                            </ListItem>
                            <Divider />
                        </List>

                        <CategoryChips
                            type={"MasterCardAction"}
                            id={masterCardActionInfo.id}
                        />

                        <CategorySelectorDialog
                            type={"MasterCardAction"}
                            item={masterCardActionInfo}
                            onClose={this.toggleCategoryDialog}
                            open={this.state.displayCategories}
                        />

                        <SpeedDial
                            hidden={false}
                            actions={[
                                {
                                    name: "Send payment",
                                    icon: ArrowUpIcon,
                                    color: "action",
                                    onClick: this.startPayment
                                },
                                {
                                    name: "Send request",
                                    icon: ArrowDownIcon,
                                    color: "action",
                                    onClick: this.startRequest
                                },
                                {
                                    name: t("Manage categories"),
                                    icon: BookmarkIcon,
                                    onClick: this.toggleCategoryDialog
                                },
                                {
                                    name: t("View debug information"),
                                    icon: HelpIcon,
                                    onClick: event =>
                                        this.setState({ displayExport: true })
                                }
                            ]}
                        />
                    </Grid>
                </Grid>
            );
        }

        const exportData =
            this.props.masterCardActionInfo &&
            this.props.masterCardActionInfo._rawData
                ? this.props.masterCardActionInfo._rawData.MasterCardAction
                : {};

        return (
            <Grid container spacing={24}>
                <Helmet>
                    <title>{`BunqDesktop - ${t("Mastercard Info")}`}</title>
                </Helmet>

                <ExportDialog
                    closeModal={event =>
                        this.setState({ displayExport: false })}
                    title={t("Export info")}
                    open={this.state.displayExport}
                    object={exportData}
                />

                <Grid item xs={12} sm={2} lg={3}>
                    <Button
                        onClick={this.props.history.goBack}
                        style={styles.btn}
                    >
                        <ArrowBackIcon />
                    </Button>
                </Grid>

                <Grid item xs={12} sm={8} lg={6}>
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
        accounts: state.accounts.accounts,
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
    withTheme()(translate("translations")(MasterCardActionInfo))
);
