import React from "react";
import { Pie } from "react-chartjs-2";
import {
    bunqMeTabColor,
    masterCardActionColor,
    paymentColor,
    requestInquiryColor,
    requestResponseColor
} from "../../Colors";
import { moneyTemplate } from "../../../../Helpers/StatsFormattingTemplates";

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
        labels: ["Payments", "Card payments", "Requests sent", "Requests received", "bunq.me requests"],
        datasets: [
            {
                data: [
                    props.paymentTransactionHistory.reduce(countReducer, 0),
                    props.masterCardActionTransactionHistory.reduce(countReducer, 0),
                    props.requestInquiryTransactionHistory.reduce(countReducer, 0),
                    props.requestResponseTransactionHistory.reduce(countReducer, 0),
                    props.bunqMeTabTransactionHistory.reduce(countReducer, 0)
                ],
                backgroundColor: [
                    paymentColor,
                    masterCardActionColor,
                    requestInquiryColor,
                    requestResponseColor,
                    bunqMeTabColor
                ],
                hoverBackgroundColor: [
                    paymentColor,
                    masterCardActionColor,
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
