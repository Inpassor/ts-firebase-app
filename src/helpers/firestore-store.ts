import * as session from 'express-session';
import * as admin from 'firebase-admin';

import {
    Data,
    FirestoreCollectionReference,
} from '../interfaces';

export interface FirestoreStoreParser {
    read: (data: Data) => Data;
    save: (data: Data) => Data;
}

export interface FirestoreStoreOptions {
    collection?: string;
    database: admin.firestore.Firestore;
    parser?: FirestoreStoreParser;
}

export class FirestoreStore extends session.Store {

    private _collectionReference: FirestoreCollectionReference = null;
    private _parser: FirestoreStoreParser = null;

    constructor(options: FirestoreStoreOptions) {
        super();
        this._collectionReference = options.database.collection(options.collection || 'sessions');
        this._parser = options.parser || {
            read(data: Data): Data {
                return JSON.parse(data.session);
            },
            save(data: Data): Data {
                return {
                    session: JSON.stringify(data),
                };
            }
        };
    }

    public all(cb): void {
        this._collectionReference.get()
            .then(snapshot => {
                const docs = snapshot.docs.map(doc => this._parser.read(doc.data()));
                cb(null, docs);
            })
            .catch(cb);
    }

    public destroy(sid: string, cb): void {
        this._collectionReference.doc(sid)
            .delete()
            .then(() => cb(null))
            .catch(cb);
    }

    public clear(cb): void {
        this._collectionReference.get()
            .then(snapshot => Promise
                .all(snapshot.docs.map(doc => doc.ref.delete()))
                .then(() => cb(null))
            )
            .catch(cb);
    }

    public length(cb): void {
        this._collectionReference.get()
            .then(snapshot => cb(null, snapshot.docs.length))
            .catch(cb);
    }

    public get(sid: string, cb): void {
        this._collectionReference.doc(sid)
            .get()
            .then(doc => {
                if (doc.exists === true) {
                    const sessionData = this._parser.read(doc.data());
                    cb(null, sessionData);
                } else {
                    cb(null, null);
                }
            })
            .catch(cb);
    }

    public set(sid: string, sessionData: Data, cb): void {
        const data = this._parser.save(sessionData);
        this._collectionReference.doc(sid)
            .set(data)
            .then(() => cb(null))
            .catch(cb);
    }

    public touch(sid: string, sessionData: Data, cb): void {
        this.set(sid, sessionData, cb);
    }

}
