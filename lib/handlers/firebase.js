"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
var firebaseApp = null;
var firestore = null;
exports.firebase = function (options) {
    return function (request, response, next) {
        if (!firebaseApp || !firestore) {
            if (options) {
                var appOptions = {};
                var firestoreOptions = {
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
//# sourceMappingURL=firebase.js.map