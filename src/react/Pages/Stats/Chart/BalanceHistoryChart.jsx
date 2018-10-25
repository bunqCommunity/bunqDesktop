import React from "react";
import { Bar } from "react-chartjs-2";
import { balanceColor, eventCountColor } from "../Colors";

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
                type: "line",
                label: "Balance history",
                data: props.balanceHistoryData,
                fill: false,
                lineTension: 0,
                pointRadius: 5,
                borderColor: balanceColor,
                backgroundColor: balanceColor,
                pointBorderColor: balanceColor,
                pointBackgroundColor: balanceColor,
                pointHoverBackgroundColor: balanceColor,
                pointHoverBorderColor: balanceColor,
                yAxisID: "balance"
            },
            {
                type: "bar",
                label: "Total events",
                data: props.eventCountHistory,
                fill: false,
                backgroundColor: eventCountColor,
                borderColor: eventCountColor,
                hoverBackgroundColor: eventCountColor,
                hoverBorderColor: eventCountColor,
                yAxisID: "events"
            }
        ]
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
            enabled: true,
            mode: "index"
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
                {
                    type: "linear",
                    display: true,
                    position: "left",
                    id: "balance",
                    labels: {
                        show: true
                    },
                    gridLines: {
                        display: true,
                        color: "rgb(255, 99, 132, 70)"
                    },
                    ticks: {
                        fontColor: props.theme.palette.text.primary,
                        beginAtZero: true
                    }
                },
                {
                    stacked: true,
                    type: "linear",
                    display: true,
                    position: "right",
                    id: "events",
                    labels: {
                        show: true
                    },
                    gridLines: {
                        display: true,
                        color: "rgb(54, 162, 235, 70)"
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
                    }
                }
            ]
        }
    };

    return <Bar height={defaultOptions.height} data={chartData} options={chartOptions} />;
};
