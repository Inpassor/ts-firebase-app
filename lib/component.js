"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("./helpers");
class Component {
    constructor(options) {
        this.request = null;
        this.response = null;
        this.firebaseApp = null;
        this.firestore = null;
        this.init(options);
    }
    init(options) {
        setTimeout(() => {
            Object.assign(this, options);
        }, 0);
    }
    all() {
        this.response.sendStatus(405);
    }
    // TODO: move this method to firebaseApp.db or smth..
    /*
    public transaction(updateFunction: <T>(transaction: FirestoreTransaction) => Promise<T>): Promise<any> {
        return new Promise((resolve, reject) => {
            firestore.runTransaction(<any>updateFunction).then((result) => {
                resolve(result);
            }, (error: any) => {
                reject(error);
            });
        });
    }
    */
    // TODO: move this method to firebaseApp.db or smth..
    /*
    public batch(): FirestoreWriteBatch {
        return firestore.batch();
    }
    */
    sendError(error) {
        const code = Component.getCodeFromError(error);
        const body = Component.getMessageFromError(error);
        if (body) {
            this.response.status(code);
            if (typeof body === 'string') {
                this.response.json({
                    code,
                    message: body,
                });
            }
            else {
                this.response.json(Object.assign({
                    code,
                }, body));
            }
        }
        else {
            this.response.sendStatus(code);
        }
    }
    static getCodeFromError(error) {
        const defaultCode = 500;
        if (typeof error === 'string') {
            return defaultCode;
        }
        const e = error.error || error;
        return e.code || defaultCode;
    }
    static getMessageFromError(error) {
        if (typeof error === 'string') {
            return error;
        }
        let message = 'An unexpected error occurred';
        const e = error.error || error;
        if (e) {
            if (e.message) {
                message = e.message;
            }
            else {
                const code = Number(e.code || e);
                if (helpers_1.httpStatusList.hasOwnProperty(code)) {
                    message = helpers_1.httpStatusList[code];
                }
            }
        }
        return message;
    }
}
exports.Component = Component;
//# sourceMappingURL=component.js.map