import BunqErrorHandler from "../Helpers/BunqErrorHandler";

export function masterCardActionsSetInfo(masterCardActions, account_id) {
    return {
        type: "MASTER_CARD_ACTIONS_SET_INFO",
        payload: {
            master_card_actions: masterCardActions,
            account_id: account_id
        }
    };
}

export function masterCardActionsUpdate(BunqJSClient, userId, accountId) {
    return dispatch => {
        dispatch(masterCardActionsLoading());
        BunqJSClient.api.masterCardAction
            .list(userId, accountId)
            .then(masterCardActions => {
                const masterCardActions2 =
                    masterCardActions.length > 0
                        ? masterCardActions
                        : [
                              {
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
                                  alias: {
                                      iban: "NL12BUNQ0300065264",
                                      display_name: "Mary",
                                      avatar: {
                                          uuid:
                                              "5a442bed-3d43-4a85-b532-dbb251052f4a",
                                          anchor_uuid:
                                              "f0de919f-8c36-46ee-acb7-ea9c35c1b231",
                                          image: [
                                              {
                                                  attachment_public_uuid:
                                                      "d93e07e3-d420-45e5-8684-fc0c09a63686",
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
                                                  "5a442bed-3d43-4a85-b532-dbb251052f4a",
                                              anchor_uuid:
                                                  "f0de919f-8c36-46ee-acb7-ea9c35c1b231",
                                              image: [
                                                  {
                                                      attachment_public_uuid:
                                                          "d93e07e3-d420-45e5-8684-fc0c09a63686",
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
                                  counterparty_alias: {
                                      iban: "NL12BUNQ0300065264",
                                      display_name: "Mary",
                                      avatar: {
                                          uuid:
                                              "5a442bed-3d43-4a85-b532-dbb251052f4a",
                                          anchor_uuid:
                                              "f0de919f-8c36-46ee-acb7-ea9c35c1b231",
                                          image: [
                                              {
                                                  attachment_public_uuid:
                                                      "d93e07e3-d420-45e5-8684-fc0c09a63686",
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
                                                  "5a442bed-3d43-4a85-b532-dbb251052f4a",
                                              anchor_uuid:
                                                  "f0de919f-8c36-46ee-acb7-ea9c35c1b231",
                                              image: [
                                                  {
                                                      attachment_public_uuid:
                                                          "d93e07e3-d420-45e5-8684-fc0c09a63686",
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
                                                          "d93e07e3-d420-45e5-8684-fc0c09a63686",
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
                              }
                          ];

                dispatch(
                    masterCardActionsSetInfo(masterCardActions2, accountId)
                );
                dispatch(masterCardActionsNotLoading());
            })
            .catch(error => {
                dispatch(masterCardActionsNotLoading());
                BunqErrorHandler(
                    dispatch,
                    error,
                    "We received the following error while loading your master card payments"
                );
            });
    };
}

export function masterCardActionsLoading() {
    return { type: "MASTER_CARD_ACTIONS_IS_LOADING" };
}

export function masterCardActionsNotLoading() {
    return { type: "MASTER_CARD_ACTIONS_IS_NOT_LOADING" };
}

export function masterCardActionsClear() {
    return { type: "MASTER_CARD_ACTIONS_CLEAR" };
}
