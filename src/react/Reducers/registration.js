export const defaultState = {
    // unencrypted api key, this should NEVER be stored elsewhere
    api_key: false,
    permitted_ips: [],
    encrypted_api_key: false,

    // if true there is a stored api key
    has_stored_api_key: false,

    // list of encrypted api keys
    stored_api_keys: [],

    // if true, the application will try to load the encryption keys using a default password
    use_no_password: false,
    device_name: "My device",
    environment: "PRODUCTION",
    derived_password: false,
    identifier: false,

    ready: false,
    loading: false
};

export default (state = defaultState, action) => {
    switch (action.type) {
        case "REGISTRATION_REMOVE_STORED_API_KEY":
        case "REGISTRATION_SET_STORED_API_KEYS":
            return {
                ...state,
                stored_api_keys: action.payload.stored_api_keys
            };

        case "REGISTRATION_RESET_TO_API_SCREEN":
            return {
                ...state,
                ready: false,
                api_key: false,
                encrypted_api_key: false,
                has_stored_api_key: false
            };

        case "REGISTRATION_LOG_OUT":
            return {
                ...state,
                ready: false,
                api_key: false,
                encrypted_api_key: false,
                has_stored_api_key: action.payload.reset_stored_api_key === true ? false : true,
                derived_password: false
            };

        case "REGISTRATION_SET_BUNQ_DESKTOP_CLIENT_DATA":
            return {
                ...state,
                derived_password: action.payload.derived_password,
                derived_password_salt: action.payload.derived_password_salt,
                identifier: action.payload.identifier,

                api_key: action.payload.api_key,
                encrypted_api_key: action.payload.encrypted_api_key,
                encrypted_api_key_iv: action.payload.encrypted_api_key_iv,
                device_name: action.payload.device_name,
                environment: action.payload.environment,
                permitted_ips: action.payload.permitted_ips,

                has_stored_api_key: action.payload.has_stored_api_key,
                stored_api_keys: action.payload.stored_api_keys,
                use_no_password: action.payload.use_no_password
            };

        case "REGISTRATION_READY":
            return {
                ...state,
                ready: true
            };
        case "REGISTRATION_NOT_READY":
            return {
                ...state,
                ready: false
            };
        case "REGISTRATION_LOADING":
            return {
                ...state,
                loading: true
            };
        case "REGISTRATION_NOT_LOADING":
            return {
                ...state,
                loading: false
            };

        case "REGISTRATION_CLEAR_PRIVATE_DATA":
            return {
                ...state,
                api_key: false,
                ready: false,
                encrypted_api_key: false,
                stored_api_keys: [],
                has_stored_api_key: false,
                derived_password: false
            };
    }
    return state;
};
