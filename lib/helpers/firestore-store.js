"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const session = require("express-session");
class FirestoreStore extends session.Store {
    constructor(options) {
        super();
        this._collectionReference = null;
        this._parser = null;
        this._collectionReference = options.database.collection(options.collection || 'sessions');
        this._parser = options.parser || {
            read(data) {
                return JSON.parse(data.session);
            },
            save(data) {
                return {
                    session: JSON.stringify(data),
                };
            }
        };
    }
    all(cb) {
        this._collectionReference.get()
            .then(snapshot => {
            const docs = snapshot.docs.map(doc => this._parser.read(doc.data()));
            cb(null, docs);
        })
            .catch(cb);
    }
    destroy(sid, cb) {
        this._collectionReference.doc(sid)
            .delete()
            .then(() => cb(null))
            .catch(cb);
    }
    clear(cb) {
        this._collectionReference.get()
            .then(snapshot => Promise
            .all(snapshot.docs.map(doc => doc.ref.delete()))
            .then(() => cb(null)))
            .catch(cb);
    }
    length(cb) {
        this._collectionReference.get()
            .then(snapshot => cb(null, snapshot.docs.length))
            .catch(cb);
    }
    get(sid, cb) {
        this._collectionReference.doc(sid)
            .get()
            .then(doc => {
            if (doc.exists === true) {
                const sessionData = this._parser.read(doc.data());
                cb(null, sessionData);
            }
            else {
                cb(null, null);
            }
        })
            .catch(cb);
    }
    set(sid, sessionData, cb) {
        const data = this._parser.save(sessionData);
        this._collectionReference.doc(sid)
            .set(data)
            .then(() => cb(null))
            .catch(cb);
    }
    touch(sid, sessionData, cb) {
        this.set(sid, sessionData, cb);
    }
}
exports.FirestoreStore = FirestoreStore;
//# sourceMappingURL=firestore-store.js.map