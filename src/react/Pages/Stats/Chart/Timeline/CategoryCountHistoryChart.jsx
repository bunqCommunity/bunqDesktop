import React from "react";
import { Bar } from "react-chartjs-2";
import { sortLinearChartTooltips } from "../../../../Functions/StatsFormattingTemplates";

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

    const dataSets = [];
    const yAxes = [];
    let firstItem = true;
    Object.keys(props.categoryCountHistory).forEach(categoryKey => {
        const categoryCount = props.categoryCountHistory[categoryKey];
        const category = props.categories[categoryKey];

        // add data set for this category
        dataSets.push({
            yAxesID: category.id,
            label: category.label,
            data: categoryCount,
            backgroundColor: category.color,
            borderColor: category.color,
            hoverBackgroundColor: category.color,
            hoverBorderColor: category.color
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
