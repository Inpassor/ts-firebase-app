"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const helmet = require("helmet");
const session = require("express-session");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const sanitizer = require("express-sanitizer");
const FirestoreStore = require("firestore-store");
const handlers_1 = require("./handlers");
const admin = require("firebase-admin");
exports.expressApp = (config) => {
    const app = express();
    app.config = config;
    if (config.helmet) {
        app.use(helmet(config.helmet));
    }
    if (config.firebase) {
        const appOptions = {};
        const firestoreOptions = {
            timestampsInSnapshots: config.firebase.timestampsInSnapshots,
        };
        if (config.firebase.projectId) {
            appOptions.projectId = config.firebase.projectId;
            firestoreOptions.projectId = config.firebase.projectId;
        }
        if (config.firebase.keyFileName) {
            appOptions.credential = admin.credential.cert(config.firebase.keyFileName);
            firestoreOptions.keyFilename = config.firebase.keyFileName;
        }
        if (config.firebase.databaseAuthVariableOverride) {
            appOptions.databaseAuthVariableOverride = config.firebase.databaseAuthVariableOverride;
        }
        if (config.firebase.databaseURL) {
            appOptions.databaseURL = config.firebase.databaseURL;
        }
        if (config.firebase.serviceAccountId) {
            appOptions.serviceAccountId = config.firebase.serviceAccountId;
        }
        if (config.firebase.storageBucket) {
            appOptions.storageBucket = config.firebase.storageBucket;
        }
        if (!app.locals.firebaseApp) {
            app.locals.firebaseApp = admin.initializeApp(appOptions) || null;
        }
        if (!app.locals.firestore) {
            app.locals.firestore = app.locals.firebaseApp && app.locals.firebaseApp.firestore() || null;
            if (app.locals.firestore) {
                app.locals.firestore.settings(firestoreOptions);
            }
        }
    }
    if (config.session) {
        const sessionOptions = {
            resave: true,
            saveUninitialized: true
        };
        if (config.session.firestoreCollection && app.locals.firestore) {
            sessionOptions.store = new FirestoreStore(session)({
                database: app.locals.firestore,
                collection: config.session.firestoreCollection,
            });
        }
        app.use(session(Object.assign({}, config.session, sessionOptions)));
    }
    if (config.cors) {
        app.use(cors(config.cors));
    }
    if (config.cookieParser && config.cookieParser.secret) {
        app.use(cookieParser(config.cookieParser.secret, config.cookieParser.options));
    }
    if (config.bodyParser) {
        if (config.bodyParser.raw) {
            app.use(bodyParser.raw(config.bodyParser.raw));
        }
        if (config.bodyParser.json) {
            app.use(bodyParser.json(config.bodyParser.json));
        }
        if (config.bodyParser.text) {
            app.use(bodyParser.text(config.bodyParser.text));
        }
        if (config.bodyParser.urlencoded) {
            app.use(bodyParser.urlencoded(config.bodyParser.urlencoded));
        }
    }
    if (config.sanitizer) {
        app.use(sanitizer(config.sanitizer));
        app.use(handlers_1.sanitize);
    }
    if (config.models) {
        app.use(handlers_1.models(config.models));
    }
    if (config.routes) {
        app.use(handlers_1.routes({
            routes: config.routes,
            authType: config.authType,
        }));
    }
    if (config.viewsPath) {
        app.set('views', config.viewsPath);
        app.set('view engine', 'ejs');
        app.engine(config.viewsExtension || 'html', ejs.renderFile);
    }
    return app;
};
//# sourceMappingURL=express-app.js.map