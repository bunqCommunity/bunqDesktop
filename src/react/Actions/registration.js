export function registrationSetApiKey(api_key) {
    return {
        type: "REGISTRATION_SET_API_KEY",
        payload: {
            api_key: api_key
        }
    };
}

export function registrationSetDeviceName(device_name) {
    return {
        type: "REGISTRATION_SET_DEVICE_NAME",
        payload: {
            device_name: device_name
        }
    };
}

export function registrationSetEnvironment(environment) {
    if (environment !== "PRODUCTION" && environment !== "SANDBOX")
        environment = "SANDBOX";
    return {
        type: "REGISTRATION_SET_ENVIRONMENT",
        payload: {
            environment: environment
        }
    };
}

export function registrationClearApiKey(BunqJSClient) {
    return dispatch => {
        BunqJSClient.destroySession().then(_ => {
            dispatch({
                type: "REGISTRATION_CLEAR_API_KEY"
            });
        });
    };
}

export function registrationLoading() {
    return {
        type: "REGISTRATION_LOADING"
    };
}

export function registrationNotLoading() {
    return {
        type: "REGISTRATION_NOT_LOADING"
    };
}
