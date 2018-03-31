import React from "react";
import { Bar } from "react-chartjs-2";
import {
    balanceColor,
    bunqMeTabColor,
    masterCardActionColor,
    paymentColor,
    requestInquiryColor,
    requestResponseColor
} from "./Colors";

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
                label: "Master Card Payments",
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

    const barChartInfo = (id, showAxis = false, changes = {}) => {
        return {
            stacked: true,
            display: showAxis,
            position: "left",
            type: "linear",
            gridLines: {
                display: showAxis
            },
            ticks: {
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
            mode: "index"
        },
        scales: {
            xAxes: [
                {
                    stacked: true,
                    display: true,
                    gridLines: {
                        display: true
                    },
                    labels: props.labels
                }
            ],
            yAxes: [
                barChartInfo("payment", true),
                barChartInfo("masterCardActions", false),
                barChartInfo("requestInquiry", false),
                barChartInfo("requestResponse", false),
                barChartInfo("bunqMeTab", false)
            ]
        }
    };

    return (
        <Bar
            height={defaultOptions.height}
            data={chartData}
            options={chartOptions}
        />
    );
};
