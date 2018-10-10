import BunqErrorHandler from "../Helpers/BunqErrorHandler";
import { storeDecryptString } from "../Helpers/CryptoWorkerWrapper";
import RequestInquiryBatch from "../Models/RequestInquiryBatch";

export const STORED_REQUEST_INQUIRY_BATCHES = "BUNQDESKTOP_STORED_REQUEST_INQUIRY_BATCHES";

export function requestInquiryBatchesSetInfo(
    requestInquiryBatches,
    account_id,
    resetOldItems = false,
    BunqJSClient = false
) {
    const type = resetOldItems ? "REQUEST_INQUIRY_BATCHES_SET_INFO" : "REQUEST_INQUIRY_BATCHES_UPDATE_INFO";

    return {
        type: type,
        payload: {
            BunqJSClient,
            requestInquiryBatches,
            account_id
        }
    };
}

export function loadStoredrequestInquiryBatches(BunqJSClient) {
    return dispatch => {
        dispatch(requestInquiryBatchesLoading());
        storeDecryptString(STORED_REQUEST_INQUIRY_BATCHES, BunqJSClient.Session.encryptionKey)
            .then(data => {
                if (data && data.items) {
                    const requestInquiryBatchesNew = data.items.map(item => new RequestInquiryBatch(item));
                    dispatch(requestInquiryBatchesSetInfo(requestInquiryBatchesNew, data.account_id));
                }
                dispatch(requestInquiryBatchesNotLoading());
            })
            .catch(error => {
                dispatch(requestInquiryBatchesNotLoading());
            });
    };
}

export function requestInquiryBatchesUpdate(
    BunqJSClient,
    user_id,
    accountId,
    options = {
        count: 200,
        newer_id: false,
        older_id: false
    }
) {
    const failedMessage = window.t("We failed to load the batched request inquiries for this monetary account");

    return dispatch => {
        dispatch(requestInquiryBatchesLoading());
        BunqJSClient.api.requestInquiryBatch
            .list(user_id, accountId, options)
            .then(requestInquiryBatches => {
                const requestInquiryBatchesNew = requestInquiryBatches.map(item => new RequestInquiryBatch(item));

                dispatch(requestInquiryBatchesSetInfo(requestInquiryBatchesNew, accountId, false, BunqJSClient));
                dispatch(requestInquiryBatchesNotLoading());
            })
            .catch(error => {
                dispatch(requestInquiryBatchesNotLoading());
                BunqErrorHandler(dispatch, error, failedMessage);
            });
    };
}

export function requestInquiryBatchesLoading() {
    return { type: "REQUEST_INQUIRY_BATCHES_IS_LOADING" };
}

export function requestInquiryBatchesNotLoading() {
    return { type: "REQUEST_INQUIRY_BATCHES_IS_NOT_LOADING" };
}

export function requestInquiryBatchesClear() {
    return { type: "REQUEST_INQUIRY_BATCHES_CLEAR" };
}
