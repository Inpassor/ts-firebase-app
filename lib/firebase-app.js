"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var functions = require("firebase-functions");
var express_app_1 = require("./express-app");
exports.firebaseApp = function (config) {
    return functions.https.onRequest(express_app_1.expressApp(config));
};
//# sourceMappingURL=firebase-app.js.map