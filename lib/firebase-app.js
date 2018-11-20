"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express_app_1 = require("./express-app");
exports.firebaseApp = (getConfig) => {
    return functions.https.onRequest((request, response) => {
        return new Promise((resolve, reject) => {
            Promise.resolve(getConfig).then((config) => {
                const app = express_app_1.expressApp(config);
                resolve(app(request, response));
            }, (error) => {
                reject(error);
            });
        });
    });
};
//# sourceMappingURL=firebase-app.js.map