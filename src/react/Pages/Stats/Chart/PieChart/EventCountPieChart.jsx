import React from "react";
import { Pie } from "react-chartjs-2";
import {
    bunqMeTabColor,
    masterCardActionColor,
    paymentColor,
    requestInquiryColor,
    requestResponseColor
} from "../../Colors";

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
                    props.payments.length,
                    props.masterCardActions.length,
                    props.requestInquiries.length,
                    props.requestResponses.length,
                    props.bunqMeTabs.length
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
