const log = require("loglevel");

// set logging level based on env
log.setLevel(process.env.NODE_ENV === "development" ? "trace" : "warn");

// export the logger
module.exports = log;
