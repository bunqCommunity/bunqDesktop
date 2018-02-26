import React from "react";
import { connect } from "react-redux";
import Helmet from "react-helmet";
import Paper from "material-ui/Paper";
import Grid from "material-ui/Grid";
import { Line } from "react-chartjs-2";
import { masterCardActionFilter, paymentFilter } from "../Helpers/DataFilters";

class Stats extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.state = {};
    }

    paymentMapper = () => {
        const data = [];
        this.props.payments
            .filter(
                paymentFilter({
                    paymentVisibility: this.props.paymentVisibility,
                    paymentType: this.props.paymentType
                })
            )
            .map(payment => {
                const paymentInfo = payment.Payment;
                let change = parseFloat(paymentInfo.amount.value);
                if (change < 0) change = change * -1;

                if (
                    paymentInfo.alias.label_user.uuid ===
                    this.props.user.public_uuid
                ) {
                    // incoming payment
                    change = change * -1;
                }

                data.push({
                    date: new Date(paymentInfo.updated),
                    change: change
                });
            });
        return data;
    };

    masterCardActionMapper = () => {
        const data = [];
        this.props.masterCardActions
            .filter(
                masterCardActionFilter({
                    paymentVisibility: this.props.paymentVisibility,
                    paymentType: this.props.paymentType
                })
            )
            .map(masterCardAction => {
                const masterCardInfo = masterCardAction.MasterCardAction;

                const change = parseFloat(masterCardInfo.amount_billing.value);
                const validTypes = [
                    "CLEARING_REFUND",
                    "PRE_AUTHORISED",
                    "PRE_AUTHORISATION_FINALISED",
                    "ACQUIRER_AUTHORISED",
                    "AUTHORISED",
                    "AUTHORISED_PARTIAL",
                    "STAND_IN_AUTHORISED",
                    "UNAUTHORISED_CLEARING"
                ];

                if (validTypes.includes(masterCardInfo.authorisation_status)) {
                    data.push({
                        date: new Date(masterCardInfo.updated),
                        change: -change
                    });
                }
            });
        return data;
    };

    roundMoney = amount => {
        return Math.round(amount * 100) / 100;
    };

    labelFormat = date => {
        return `${date.getMonth() + 1}/${date.getDate()}`;
        // return `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    };

    render() {
        const payments = this.paymentMapper();
        const masterCardActions = this.masterCardActionMapper();

        let accountInfo = false;
        this.props.accounts.map(account => {
            if (
                account.MonetaryAccountBank.id === this.props.selectedAccount ||
                this.props.selectedAccount === false
            ) {
                accountInfo = account.MonetaryAccountBank;
            }
        });
        let currentBalance = parseFloat(accountInfo.balance.value);

        const yList = [currentBalance];
        const xList = [];
        const data = {};

        // generate empty list for dates in the past 30 days
        for (let day = 0; day < 30; day++) {
            const dateOffset = day <= 0 ? 0 : 24 * 60 * 60 * 1000 * day;
            const myDate = new Date();
            myDate.setTime(myDate.getTime() - dateOffset);
            const label = this.labelFormat(myDate);

            data[label] = [];
            xList.push(label);
        }

        // combine the list
        [...masterCardActions, ...payments]
            .sort((a, b) => {
                return b.date - a.date;
            })
            .forEach(item => {
                const label = this.labelFormat(item.date);
                if (data[label]) {
                    data[label].push(item);
                }
            });

        // loop through all the days
        Object.keys(data).map(label => {
            // calculate the total change for that day
            let dailyChange = 0;
            data[label].map(item => {
                dailyChange = dailyChange + item.change;
            });

            // update balance and push it to the list
            currentBalance = currentBalance + dailyChange;
            yList.push(this.roundMoney(currentBalance));
        });

        console.log(xList, yList);

        return (
            <Grid container spacing={16}>
                <Helmet>
                    <title>{`BunqDesktop - Stats`}</title>
                </Helmet>

                <Grid item xs={12}>
                    <Paper>
                        <Line
                            data={{
                                labels: yList,
                                datasets: [
                                    {
                                        label: "My First dataset",
                                        backgroundColor: "rgb(255, 99, 132)",
                                        borderColor: "rgb(255, 99, 132)",
                                        data: xList,
                                        fill: false
                                    }
                                ]
                            }}
                            height={450}
                            options={{
                                maintainAspectRatio: false,
                                responsive: true,
                                title: {
                                    display: true,
                                    text: "Data title haha"
                                },
                                tooltips: {
                                    position: "nearest",
                                    mode: "index",
                                    intersect: false
                                }
                            }}
                        />
                    </Paper>
                </Grid>
            </Grid>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user.user,
        accounts: state.accounts.accounts,
        selectedAccount: state.accounts.selectedAccount,

        paymentType: state.payment_filter.type,
        paymentVisibility: state.payment_filter.visible,

        masterCardActions: state.master_card_actions.master_card_actions,
        masterCardActionsLoading: state.master_card_actions.loading,

        payments: state.payments.payments,
        paymentsLoading: state.payments.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
