"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Component = /** @class */ (function () {
    function Component(options) {
        this.request = null;
        this.response = null;
        this.init(options);
    }
    Component.prototype.init = function (options) {
        var _this = this;
        setTimeout(function () {
            Object.assign(_this, options);
        }, 0);
    };
    Component.prototype.all = function () {
        this.response.sendStatus(405);
    };
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
    Component.prototype.sendError = function (error) {
        var code = Component.getCodeFromError(error);
        var body = Component.getBodyFromError(error);
        if (body) {
            this.response.status(code);
            if (typeof body === 'string') {
                this.response.send(body);
            }
            else {
                this.response.json(body);
            }
        }
        else {
            this.response.sendStatus(code);
        }
    };
    Component.getCodeFromError = function (error) {
        var defaultCode = 500;
        if (typeof error === 'string') {
            return defaultCode;
        }
        var e = error.error || error;
        return e.code || defaultCode;
    };
    Component.getBodyFromError = function (error) {
        if (typeof error === 'string') {
            return error;
        }
        var e = error.error || error;
        if (e.code) {
            delete e.code;
        }
        return e.message || Object.keys(e).length ? e : null;
    };
    return Component;
}());
exports.Component = Component;
//# sourceMappingURL=component.js.map