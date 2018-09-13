export const queueIncreaseRequestCounter = () => {
    return {
        type: "QUEUE_INCREASE_REQUEST_COUNTER"
    };
};

export const queueSetRequestCounter = counter => {
    return {
        type: "QUEUE_SET_REQUEST_COUNTER",
        payload: {
            counter: counter
        }
    };
};

export const queueDecreaseRequestCounter = () => {
    return {
        type: "QUEUE_DECREASE_REQUEST_COUNTER"
    };
};

export const queueFinishedSync = () => {
    return {
        type: "QUEUE_FINISHED_SYNC"
    };
};
export const queueStartSync = () => {
    return {
        type: "QUEUE_START_SYNC"
    };
};
export const queueResetSyncState = () => {
    return {
        type: "QUEUE_RESET_SYNC_STATE"
    };
};
