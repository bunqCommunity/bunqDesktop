import React from "react";
import { Pie } from "react-chartjs-2";

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
    Object.keys(props.categoryCountHistory).forEach(categoryKey => {
        const categoryCount = props.categoryCountHistory[categoryKey];
        const category = props.categories[categoryKey];

        // add the total count of this category to the data set
        data.push(categoryCount.reduce((accumulator, currentValue) => accumulator + currentValue, 0));
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
