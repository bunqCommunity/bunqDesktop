const Logger = require("../Helpers/Logger");

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

export function registrationClearApiKey() {
    return {
        type: "REGISTRATION_CLEAR_API_KEY"
    };
}
