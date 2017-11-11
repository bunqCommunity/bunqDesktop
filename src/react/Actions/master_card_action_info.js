import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function masterCardActionSetInfo(
    master_card_action_info,
    account_id,
    master_card_action_id
) {
    return {
        type: "MASTER_CARD_ACTION_INFO_SET_INFO",
        payload: {
            master_card_action_info: master_card_action_info,
            master_card_action_id: master_card_action_id,
            account_id: account_id
        }
    };
}

export function masterCardActionInfoUpdate(
    BunqJSClient,
    user_id,
    account_id,
    master_card_action_id
) {
    return dispatch => {
        dispatch(masterCardActionInfoLoading());

        const testData = {
            monetary_account_id: 1,
            card_id: 1,
            amount_local: {
                value: "12.50",
                currency: "EUR"
            },
            amount_billing: {
                value: "12.50",
                currency: "EUR"
            },
            amount_original_local: {
                value: "12.50",
                currency: "EUR"
            },
            amount_original_billing: {
                value: "12.50",
                currency: "EUR"
            },
            amount_fee: {
                value: "12.50",
                currency: "EUR"
            },
            decision: "",
            decision_description: "",
            decision_description_translated: "",
            description: "",
            authorisation_status: "",
            authorisation_type: "",
            pan_entry_mode_user: "",
            city: "",
            counterparty_alias: {
                iban: "NL12BUNQ0300065264",
                display_name: "Mary",
                avatar: {
                    uuid:
                        "61c3be0b-4953-4762-8118-b42b0ee994bb",
                    anchor_uuid:
                        "f0de919f-8c36-46ee-acb7-ea9c35c1b231",
                    image: [
                        {
                            attachment_public_uuid:
                                "61c3be0b-4953-4762-8118-b42b0ee994bb",
                            content_type: "image/jpeg",
                            height: 380,
                            width: 520
                        }
                    ]
                },
                label_user: {
                    uuid:
                        "252e-fb1e-04b74214-b9e9467c3-c6d2fbf",
                    avatar: {
                        uuid:
                            "61c3be0b-4953-4762-8118-b42b0ee994bb",
                        anchor_uuid:
                            "f0de919f-8c36-46ee-acb7-ea9c35c1b231",
                        image: [
                            {
                                attachment_public_uuid:
                                    "61c3be0b-4953-4762-8118-b42b0ee994bb",
                                content_type:
                                    "image/jpeg",
                                height: 380,
                                width: 520
                            }
                        ]
                    },
                    public_nick_name: "Mary",
                    display_name: "Mary",
                    country: "NL"
                },
                country: "NL",
                bunq_me: {
                    type: "EMAIL",
                    value: "bravo@bunq.com",
                    name: ""
                },
                is_light: false,
                swift_bic: "BUNQNL2A",
                swift_account_number: "123456789"
            },
            label_card: {
                uuid:
                    "252e-fb1e-04b74214-b9e9467c3-c6d2fbf",
                type: "",
                second_line: "",
                expiry_date: "",
                status: "",
                label_user: {
                    uuid:
                        "252e-fb1e-04b74214-b9e9467c3-c6d2fbf",
                    avatar: {
                        uuid:
                            "5a442bed-3d43-4a85-b532-dbb251052f4a",
                        anchor_uuid:
                            "f0de919f-8c36-46ee-acb7-ea9c35c1b231",
                        image: [
                            {
                                attachment_public_uuid:
                                    "61c3be0b-4953-4762-8118-b42b0ee994bb",
                                content_type:
                                    "image/jpeg",
                                height: 380,
                                width: 520
                            }
                        ]
                    },
                    public_nick_name: "Mary",
                    display_name: "Mary",
                    country: "NL"
                }
            },
            token_status: "",
            reservation_expiry_time: "",
            applied_limit: "",
            allow_chat: false,
            eligible_whitelist_id: ""
        };
        dispatch(
            masterCardActionSetInfo(
                testData,
                account_id,
                master_card_action_id
            )
        );
        dispatch(masterCardActionInfoNotLoading());
        // BunqJSClient.api.masterCardAction
        //     .get(user_id, account_id, master_card_action_id)
        //     .then(paymentInfo => {
        //         dispatch(
        //             masterCardActionSetInfo(
        //                 paymentInfo,
        //                 account_id,
        //                 master_card_action_id
        //             )
        //         );
        //         dispatch(masterCardActionInfoNotLoading());
        //     })
        //     .catch(error => {
        //         dispatch(masterCardActionInfoNotLoading());
        //         BunqErrorHandler(
        //             dispatch,
        //             error,
        //             "We failed to load the master card payment information"
        //         );
        //     });
    };
}

export function masterCardActionInfoLoading() {
    return { type: "MASTER_CARD_ACTION_INFO_IS_LOADING" };
}

export function masterCardActionInfoNotLoading() {
    return { type: "MASTER_CARD_ACTION_INFO_IS_NOT_LOADING" };
}

export function masterCardActionInfoClear() {
    return { type: "MASTER_CARD_ACTION_INFO_CLEAR" };
}
