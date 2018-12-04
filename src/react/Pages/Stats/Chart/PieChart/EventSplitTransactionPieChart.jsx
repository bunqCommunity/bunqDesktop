import React from "react";
import { Pie } from "react-chartjs-2";
import {
    applePayPaymentColor,
    bunqMeTabColor,
    masterCardPaymentColor,
    paymentColor,
    requestInquiryColor,
    requestResponseColor,
    tapAndPayPaymentColor
} from "../../Colors";
import { moneyTemplate } from "../../../../Functions/StatsFormattingTemplates";

const countReducer = (a, b) => a + b;

export default props => {
    const defaultOptions = {
        height: 350,
        style: {
            margin: 12
        },
        ...props
    };

    const pieChartData = {
        labels: [
            "Payments",
            "Mastercard",
            "Maestro",
            "Tap & Pay",
            "Apple Pay",
            "Requests sent",
            "Requests received",
            "bunq.me requests"
        ],
        datasets: [
            {
                data: [
                    props.paymentTransactionHistory.reduce(countReducer, 0),
                    props.masterCardPaymentTransactionHistory.reduce(countReducer, 0),
                    props.maestroPaymentTransactionHistory.reduce(countReducer, 0),
                    props.tapAndPayPaymentTransactionHistory.reduce(countReducer, 0),
                    props.applePayPaymentTransactionHistory.reduce(countReducer, 0),
                    props.requestInquiryTransactionHistory.reduce(countReducer, 0),
                    props.requestResponseTransactionHistory.reduce(countReducer, 0),
                    props.bunqMeTabTransactionHistory.reduce(countReducer, 0)
                ],
                backgroundColor: [
                    paymentColor,
                    masterCardPaymentColor,
                    requestInquiryColor,
                    tapAndPayPaymentColor,
                    applePayPaymentColor,
                    requestInquiryColor,
                    requestResponseColor,
                    bunqMeTabColor
                ],
                hoverBackgroundColor: [
                    paymentColor,
                    masterCardPaymentColor,
                    requestInquiryColor,
                    tapAndPayPaymentColor,
                    applePayPaymentColor,
                    requestInquiryColor,
                    requestResponseColor,
                    bunqMeTabColor
                ]
            }
        ]
    };

    const pieChartOptions = {
        legend: {
            position: "top",
            labels: {
                fontColor: props.theme.palette.text.primary
            }
        },
        tooltips: {
            enabled: true,
            mode: "index",
            callbacks: {
                label: function(tooltipItem, chart) {
                    // get the label for the category
                    const datasetLabel = chart.labels[tooltipItem.index] || "";

                    // get the actual value and format a label
                    return `${datasetLabel}: ${moneyTemplate(chart.datasets[0].data[tooltipItem.index])}`;
                }
            }
        }
    };

    return (
        <Pie
            style={defaultOptions.style}
            height={defaultOptions.height}
            options={pieChartOptions}
            data={pieChartData}
        />
    );
};
