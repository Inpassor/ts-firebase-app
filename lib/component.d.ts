import * as admin from 'firebase-admin';
import { IComponent, ComponentOptions, ExpressRequest, ExpressResponse } from './interfaces';
export declare class Component implements IComponent {
    request: ExpressRequest;
    response: ExpressResponse;
    firebaseApp: admin.app.App;
    firestore: admin.firestore.Firestore;
    constructor(options: ComponentOptions);
    init(options: ComponentOptions): void;
    all(): void;
    sendError(error: any): void;
    getCodeFromError: any;
    static getCodeFromError(error: any): number;
    getMessageFromError: any;
    static getMessageFromError(error: any): any;
}
