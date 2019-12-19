"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_functions_1 = require("firebase-functions");
const express_app_1 = require("./express-app");
exports.firebaseApp = (getConfig, runtimeOptions) => {
    return firebase_functions_1.runWith(runtimeOptions).https.onRequest((request, response) => __awaiter(this, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            Promise.resolve(getConfig).then((config) => {
                const app = express_app_1.expressApp(config);
                resolve(app(request, response));
            }, (error) => reject(error));
        });
    }));
};
//# sourceMappingURL=firebase-app.js.map