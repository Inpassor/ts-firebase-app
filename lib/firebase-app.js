"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express_app_1 = require("./express-app");
exports.firebaseApp = (getConfig) => {
    return functions.https.onRequest(() => {
        Promise.resolve(getConfig).then((config) => {
            express_app_1.expressApp(config);
        }, (error) => {
            console.error(error);
        });
    });
};
//# sourceMappingURL=firebase-app.js.map