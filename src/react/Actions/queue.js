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

export const queueStartSync = () => {
    return {
        type: "QUEUE_START_SYNC"
    };
}
export const queueResetSyncState = () => {
    return {
        type: "QUEUE_RESET_SYNC_STATE"
    };
}
