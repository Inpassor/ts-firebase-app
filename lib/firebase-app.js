"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express_app_1 = require("./express-app");
exports.firebaseApp = (config) => {
    return functions.https.onRequest(express_app_1.expressApp(config));
};
//# sourceMappingURL=firebase-app.js.map