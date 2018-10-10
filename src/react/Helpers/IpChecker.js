import axios from "axios";

export default async () => {
    try {
        return await axios.get("https://ipinfo.io/ip").then(response => response.data);
    } catch (ex) {
        return false;
    }
};
