import React from "react";
import { Bar } from "react-chartjs-2";
import { moneyTemplate, sortLinearChartTooltips } from "../../../../Functions/StatsFormattingTemplates";

export default props => {
    const defaultOptions = {
        height: 350,
        style: {
            margin: 12
        },
        ...props
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

    let dataSets = [];
    const yAxes = [];
    let firstItem = true;
    Object.keys(props.categoryTransactionHistory).forEach(categoryKey => {
        const categoryHistory = props.categoryTransactionHistory[categoryKey];
        const category = props.categories[categoryKey];

        const datasetTemplate = {
            yAxesID: category.id,
            label: category.label,
            backgroundColor: category.color,
            borderColor: category.color,
            hoverBackgroundColor: category.color,
            hoverBorderColor: category.color
        };

        dataSets.push({
            ...datasetTemplate,
            stack: props.transactionType,
            data: categoryHistory[props.transactionType]
        });

        // add to y axes
        yAxes.push(barChartInfo(firstItem));

        firstItem = false;
    });

    const chartData = {
        labels: props.labels,
        datasets: dataSets
    };

    const chartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        tooltips: {
            enabled: true,
            mode: "index",
            intersect: false,
            itemSort: sortLinearChartTooltips,
            callbacks: {
                label: function(tooltipItem, chart) {
                    const datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || "";
                    return `${datasetLabel}: ${moneyTemplate(tooltipItem.yLabel)}`;
                }
            }
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
                    ticks: {
                        fontColor: props.theme.palette.text.primary
                    },
                    labels: props.labels
                }
            ],
            yAxes: yAxes
        }
    };

    if (yAxes.length === 0) {
        return null;
    }

    return <Bar height={defaultOptions.height} data={chartData} options={chartOptions} />;
};
