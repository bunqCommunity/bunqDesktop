import React from "react";
import { Bar } from "react-chartjs-2";

export default props => {
    const defaultOptions = {
        height: 350,
        style: {
            margin: 12
        },
        ...props
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

    const dataSets = [];
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
        }

        // add each data set for this category
        dataSets.push({...datasetTemplate, stack: 'total', data: categoryHistory.total});
        // dataSets.push({...datasetTemplate, stack: 'sent', data: categoryHistory.sent});
        // dataSets.push({...datasetTemplate, stack: 'received', data: categoryHistory.received});

        // add to y axes
        yAxes.push(barChartInfo(category.id, firstItem));

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
            yAxes: yAxes
        }
    };

    if(yAxes.length === 0){
        return null;
    }

    return (
        <Bar
            height={defaultOptions.height}
            data={chartData}
            options={chartOptions}
        />
    );
};
