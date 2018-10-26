"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Component {
    constructor(options) {
        this.request = null;
        this.response = null;
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
        const e = error.error || error;
        if (e.code) {
            delete e.code;
        }
        return e.message || Object.keys(e).length ? e : 'An unexpected error occurred';
    }
}
exports.Component = Component;
//# sourceMappingURL=component.js.map