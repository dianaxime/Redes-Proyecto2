var aes256 = require("aes256");

var secret_key = "uI2ooxtwHeI6q69PS98fx9SWVGbpQohO";

function to_Encrypt(text) {
    var encrypted = aes256.encrypt(secret_key, text);
    return encrypted;
};

function to_Decrypt(cipher) {
    var decrypted = aes256.decrypt(secret_key, cipher);
    return decrypted;
};

module.exports = {
    to_Decrypt,
    to_Encrypt
};

