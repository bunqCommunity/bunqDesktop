// custom node-forge setup to exclude certain files
module.exports = require("node-forge/lib/forge");
require("node-forge/lib/aes");
require("node-forge/lib/cipher");
require("node-forge/lib/pbkdf2");
require("node-forge/lib/pki");
require("node-forge/lib/util");
