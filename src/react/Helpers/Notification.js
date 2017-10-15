// const Logger = require('./Logger');

module.exports = (title, message, options = {}) => {
    return new Promise((resolve, reject) => {
        // default notifcation options
        const defaultOptions = {
            icon: "https://static.useresponse.com/public/bunq/branding/favicon.ico",
            body: message
        };

        // quick helper function to combine the options and send it
        const createNotification = () => {
            // return the notification
            return new Notification(
                title,
                Object.assign({}, defaultOptions, options)
            );
        };

        // detect if notification is supported
        if (!("Notification" in window) || !Notification) {
            return reject("Notification not supported");
        }

        // request permission
        if (Notification.permission !== "granted") {
            // request permission from the user
            Notification.requestPermission(permission => {
                // store the permission
                if (!("permission" in Notification)) {
                    Notification.permission = permission;
                }
                // create the notification if we have permission
                if (permission === "granted") {
                    // resolve the notifcation
                    resolve(createNotification());
                } else {
                    // reject this notifcation request
                    reject();
                }
            });
        } else {
            // resolve the notifcation
            resolve(createNotification());
        }
    });
};
