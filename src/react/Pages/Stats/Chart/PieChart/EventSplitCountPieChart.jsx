import React from "react";
import { Pie } from "react-chartjs-2";
import {
    applePayPaymentColor,
    bunqMeTabColor,
    masterCardPaymentColor,
    paymentColor,
    requestInquiryColor,
    requestResponseColor,
    tapAndPayPaymentColor
} from "../../Colors";

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
        labels: [
            "Payments",
            "Mastercard",
            "Maestro",
            "Tap & Pay",
            "Apple Pay",
            "Requests sent",
            "Requests received",
            "bunq.me requests"
        ],
        datasets: [
            {
                data: [
                    props.paymentHistory.reduce(countReducer, 0),
                    props.masterCardPaymentCountHistory.reduce(countReducer, 0),
                    props.maestroPaymentCountHistory.reduce(countReducer, 0),
                    props.tapAndPayPaymentCountHistory.reduce(countReducer, 0),
                    props.applePayPaymentCountHistory.reduce(countReducer, 0),
                    props.requestInquiryHistory.reduce(countReducer, 0),
                    props.requestResponseHistory.reduce(countReducer, 0),
                    props.bunqMeTabHistory.reduce(countReducer, 0)
                ],
                backgroundColor: [
                    paymentColor,
                    masterCardPaymentColor,
                    requestInquiryColor,
                    tapAndPayPaymentColor,
                    applePayPaymentColor,
                    requestInquiryColor,
                    requestResponseColor,
                    bunqMeTabColor
                ],
                hoverBackgroundColor: [
                    paymentColor,
                    masterCardPaymentColor,
                    requestInquiryColor,
                    tapAndPayPaymentColor,
                    applePayPaymentColor,
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
