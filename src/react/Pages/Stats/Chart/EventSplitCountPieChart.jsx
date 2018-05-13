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
} from "../Colors";

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
                    props.paymentHistory.reduce((a, b) => a + b, 0),
                    props.masterCardPaymentCountHistory.reduce(
                        (a, b) => a + b,
                        0
                    ),
                    props.maestroPaymentCountHistory.reduce((a, b) => a + b, 0),
                    props.tapAndPayPaymentCountHistory.reduce(
                        (a, b) => a + b,
                        0
                    ),
                    props.applePayPaymentCountHistory.reduce(
                        (a, b) => a + b,
                        0
                    ),
                    props.requestInquiryHistory.reduce((a, b) => a + b, 0),
                    props.requestResponseHistory.reduce((a, b) => a + b, 0),
                    props.bunqMeTabHistory.reduce((a, b) => a + b, 0)
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
