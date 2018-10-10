import React from "react";
import { Bar } from "react-chartjs-2";
import {
    bunqMeTabColor,
    masterCardActionColor,
    paymentColor,
    requestInquiryColor,
    requestResponseColor
} from "../../Colors";
import { sortLinearChartTooltips } from "../../../../Helpers/StatsFormattingTemplates";

export default props => {
    const defaultOptions = {
        height: 350,
        style: {
            margin: 12
        },
        ...props
    };

    const chartData = {
        labels: props.labels,
        datasets: [
            {
                label: "Payments",
                data: props.paymentHistory,
                backgroundColor: paymentColor,
                borderColor: paymentColor,
                hoverBackgroundColor: paymentColor,
                hoverBorderColor: paymentColor
            },
            {
                label: "Card Payments",
                data: props.masterCardActionHistory,
                backgroundColor: masterCardActionColor,
                borderColor: masterCardActionColor,
                hoverBackgroundColor: masterCardActionColor,
                hoverBorderColor: masterCardActionColor
            },
            {
                label: "Sent Requests",
                data: props.requestInquiryHistory,
                backgroundColor: requestInquiryColor,
                borderColor: requestInquiryColor,
                hoverBackgroundColor: requestInquiryColor,
                hoverBorderColor: requestInquiryColor
            },
            {
                label: "Received Requests",
                data: props.requestResponseHistory,
                backgroundColor: requestResponseColor,
                borderColor: requestResponseColor,
                hoverBackgroundColor: requestResponseColor,
                hoverBorderColor: requestResponseColor
            },
            {
                label: "bunq.me Tabs",
                data: props.bunqMeTabHistory,
                backgroundColor: bunqMeTabColor,
                borderColor: bunqMeTabColor,
                hoverBackgroundColor: bunqMeTabColor,
                hoverBorderColor: bunqMeTabColor
            }
        ]
    };

    const barChartInfo = (showAxis = false, changes = {}) => {
        return {
            stacked: true,
            display: showAxis,
            position: "left",
            type: "linear",
            gridLines: {
                display: showAxis
            },
            ticks: {
                fontColor: props.theme.palette.text.primary,
                beginAtZero: true,
                callback: value => {
                    // only show integer values
                    if (value % 1 === 0) {
                        return value;
                    }
                }
            },
            ...changes
        };
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
            enabled: true,
            mode: "index",
            intersect: false,
            itemSort: sortLinearChartTooltips
        },
        legend: {
            labels: {
                fontColor: props.theme.palette.text.primary
            }
        },
        scales: {
            xAxes: [
                {
                    stacked: true,
                    display: true,
                    gridLines: {
                        display: true
                    },
                    labels: props.labels,
                    ticks: {
                        fontColor: props.theme.palette.text.primary
                    }
                }
            ],
            yAxes: [
                barChartInfo(true),
                barChartInfo(false),
                barChartInfo(false),
                barChartInfo(false),
                barChartInfo(false)
            ]
        }
    };

    return <Bar height={defaultOptions.height} data={chartData} options={chartOptions} />;
};
