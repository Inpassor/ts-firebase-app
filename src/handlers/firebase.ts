import * as admin from 'firebase-admin';

import {
    ExpressRequest,
    ExpressResponse,
    AppConfigFirebase,
    Firestore,
} from '../interfaces';

let firebaseApp: admin.app.App = null;
let firestore: Firestore = null;

export const firebase = (options: AppConfigFirebase) => {
    return (request: ExpressRequest, response: ExpressResponse, next: () => void): void => {
        if (!firebaseApp || !firestore) {
            if (options) {
                const appOptions: {
                    projectId?: string;
                    credential?: admin.credential.Credential;
                    databaseAuthVariableOverride?: Object;
                    databaseURL?: string;
                    serviceAccountId?: string;
                    storageBucket?: string;
                } = {};
                const firestoreOptions: {
                    projectId?: string;
                    keyFilename?: string;
                    timestampsInSnapshots: boolean;
                    [key: string]: any;
                } = {
                    timestampsInSnapshots: options.timestampsInSnapshots,
                };
                if (options.projectId) {
                    appOptions.projectId = options.projectId;
                    firestoreOptions.projectId = options.projectId;
                }
                if (options.keyFileName) {
                    appOptions.credential = admin.credential.cert(options.keyFileName);
                    firestoreOptions.keyFilename = options.keyFileName;
                }
                if (options.databaseAuthVariableOverride) {
                    appOptions.databaseAuthVariableOverride = options.databaseAuthVariableOverride;
                }
                if (options.databaseURL) {
                    appOptions.databaseURL = options.databaseURL;
                }
                if (options.serviceAccountId) {
                    appOptions.serviceAccountId = options.serviceAccountId;
                }
                if (options.storageBucket) {
                    appOptions.storageBucket = options.storageBucket;
                }
                if (!firebaseApp) {
                    firebaseApp = admin.initializeApp(appOptions) || null;
                }
                if (!firestore) {
                    firestore = firebaseApp && firebaseApp.firestore() || null;
                    if (firestore) {
                        firestore.settings(firestoreOptions);
                    }
                }
            }
        }
        request.firebaseApp = firebaseApp;
        request.firestore = firestore;
        next();
    };
};
