import * as admin from 'firebase-admin';
import {
    IComponent,
    ComponentOptions,
    ExpressRequest,
    ExpressResponse,
} from './interfaces';

export class Component implements IComponent {

    public request: ExpressRequest = null;
    public response: ExpressResponse = null;
    public firebaseApp: admin.app.App = null;
    public firestore: admin.firestore.Firestore = null;

    constructor(options: ComponentOptions) {
        this.init(options);
    }

    public init(options: ComponentOptions): void {
        setTimeout(() => {
            Object.assign(this, options);
        }, 0);
    }

    public all(): void {
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

    public sendError(error: any): void {
        const code = Component.getCodeFromError(error);
        const body = Component.getMessageFromError(error);
        if (body) {
            this.response.status(code);
            if (typeof body === 'string') {
                this.response.json({
                    code,
                    message: body,
                });
            } else {
                this.response.json(Object.assign({
                    code,
                }, body));
            }
        } else {
            this.response.sendStatus(code);
        }
    }

    public getCodeFromError;

    public static getCodeFromError(error: any): number {
        const defaultCode = 500;
        if (typeof error === 'string') {
            return defaultCode;
        }
        const e = error.error || error;
        return <number>e.code || defaultCode;
    }

    public getMessageFromError;

    public static getMessageFromError(error: any): any {
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
