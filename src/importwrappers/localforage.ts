let exportObject = {};

if (process.env.JEST) {
    exportObject = {
        config: () => {},
        getItem: () => {
            return null;
        },
        setItem: () => {}
    };
} else {
    exportObject = require("localforage");
}

export default exportObject;
