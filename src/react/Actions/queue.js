export const queueIncreaseRequestCounter = () => {
    return {
        type: "QUEUE_INCREASE_REQUEST_COUNTER"
    };
}

export const queueDecreaseRequestCounter = () => {
    return {
        type: "QUEUE_DECREASE_REQUEST_COUNTER"
    };
}
