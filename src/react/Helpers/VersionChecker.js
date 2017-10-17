import axios from "axios";

export default async () => {
    const currentVersion = CURRENT_VERSION;
    try {
        const response = await axios
            .get(
                "https://api.github.com/repos/BunqCommunity/BunqDesktop/releases/latest"
            )
            .then(response => response.data);
        const latestVersion = response.tag_name;
        return {
            currentVersion: currentVersion,
            latestVersion: latestVersion,
            newerLink:
                currentVersion !== latestVersion ? response.html_url : false
        };
    } catch (ex) {
        // fallback to no-update
        return {
            currentVersion,
            latestVersion: CURRENT_VERSION,
            newerLink: false
        };
    }
};
