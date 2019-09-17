"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const express_app_1 = require("./express-app");
exports.firebaseApp = (getConfig) => {
    return functions.https.onRequest((request, response) => __awaiter(void 0, void 0, void 0, function* () {
        yield new Promise((resolve, reject) => {
            Promise.resolve(getConfig).then((config) => {
                const app = express_app_1.expressApp(config);
                resolve(app(request, response));
            }, (error) => reject(error));
        });
    }));
};
//# sourceMappingURL=firebase-app.js.map