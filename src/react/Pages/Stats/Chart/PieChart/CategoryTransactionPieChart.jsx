import React from "react";
import { Pie } from "react-chartjs-2";
import { moneyTemplate } from "../../../../Functions/StatsFormattingTemplates";

const ensurePositive = value => {
    return value < 0 ? value * -1 : value;
};

export default props => {
    const defaultOptions = {
        height: 350,
        style: {
            margin: 12
        },
        ...props
    };

    const data = [];
    const colors = [];
    const labels = [];
    Object.keys(props.categoryTransactionHistory).forEach(categoryKey => {
        const categoryAmount = props.categoryTransactionHistory[categoryKey][props.categoryTransactionType];
        const category = props.categories[categoryKey];

        // reduce history to a single value
        const categoryValue = categoryAmount.reduce((accumulator, currentValue) => {
            if (props.categoryTransactionType !== "total") {
            }
            return accumulator + ensurePositive(currentValue);
        }, 0);

        // add the total count of this category to the data set
        data.push(categoryValue);
        // add the category color
        colors.push(category.color);
        // add the category label
        labels.push(category.label);
    });

    const pieChartData = {
        labels: labels,
        datasets: [
            {
                data: data,
                backgroundColor: colors,
                hoverBackgroundColor: colors
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
