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
        return this.props.payments
            .filter(
                paymentFilter({
                    paymentVisibility: this.props.paymentVisibility,
                    paymentType: this.props.paymentType
                })
            )
            .map(payment => {
                const paymentInfo = payment.Payment;

                let change = parseFloat(paymentInfo.amount.value);
                // if (paymentInfo.sub_type === "PAYMENT") {
                //     change = change * -1;
                // }

                return {
                    date: new Date(paymentInfo.updated),
                    change: change
                };
            });
    };

    masterCardActionMapper = () => {
        return this.props.masterCardActions
            .filter(
                masterCardActionFilter({
                    paymentVisibility: this.props.paymentVisibility,
                    paymentType: this.props.paymentType
                })
            )
            .map(masterCardAction => {
                return {
                    date: new Date(masterCardAction.MasterCardAction.updated),
                    change:
                        parseFloat(
                            masterCardAction.MasterCardAction.amount_billing
                                .value
                        ) * -1
                };
            });
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

        // current balance
        let currentBalance = parseFloat(accountInfo.balance.value);
        const yList = [];
        const xList = [];

        // combine the list
        [...masterCardActions, ...payments]
            // sort by date
            .sort((a, b) => {
                return b.date - a.date;
            })
            .reverse()
            // create the x/y list
            .map(item => {
                const date = item.date;
                currentBalance = currentBalance + item.change;

                yList.push(
                    `${date.getFullYear()}/${date.getMonth()}/${date.getDate()} ${date.getHours()}/${date.getMinutes()}`
                );
                xList.push(Math.round(currentBalance * 100) / 100);
            });

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
        bunqMeTabType: state.bunq_me_tab_filter.type,
        bunqMeTabVisibility: state.bunq_me_tab_filter.visible,
        requestType: state.request_filter.type,
        requestVisibility: state.request_filter.visible,

        bunqMeTabs: state.bunq_me_tabs.bunq_me_tabs,
        bunqMeTabsLoading: state.bunq_me_tabs.loading,
        bunqMeTabLoading: state.bunq_me_tab.loading,

        masterCardActions: state.master_card_actions.master_card_actions,
        masterCardActionsLoading: state.master_card_actions.loading,

        requestInquiries: state.request_inquiries.request_inquiries,
        requestInquiriesLoading: state.request_inquiries.loading,

        requestResponses: state.request_responses.request_responses,
        requestResponsesLoading: state.request_responses.loading,

        payments: state.payments.payments,
        paymentsLoading: state.payments.loading
    };
};

const mapDispatchToProps = dispatch => {
    return {};
};

export default connect(mapStateToProps, mapDispatchToProps)(Stats);
