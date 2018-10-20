import * as session from 'express-session';
import * as admin from 'firebase-admin';
import { Data } from '../interfaces';
export interface FirestoreStoreParser {
    read: (data: Data) => Data;
    save: (data: Data) => Data;
}
export interface FirestoreStoreOptions {
    collection?: string;
    database: admin.firestore.Firestore;
    parser?: FirestoreStoreParser;
}
export declare class FirestoreStore extends session.Store {
    private _collectionReference;
    private _parser;
    constructor(options: FirestoreStoreOptions);
    all(cb: any): void;
    destroy(sid: string, cb: any): void;
    clear(cb: any): void;
    length(cb: any): void;
    get(sid: string, cb: any): void;
    set(sid: string, sessionData: Data, cb: any): void;
    touch(sid: string, sessionData: Data, cb: any): void;
}
