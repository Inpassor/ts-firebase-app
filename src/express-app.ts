import * as express from 'express';
import * as helmet from 'helmet';
import * as session from 'express-session';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as sanitizer from 'express-sanitizer';
import * as FirestoreStore from 'firestore-store';

import {
    Data,
    Express,
    AppConfig,
} from './interfaces';
import {
    sanitize,
    models,
    routes,
} from './handlers';
import * as admin from "firebase-admin";

export const expressApp = (config: AppConfig): Express => {
    const app = <Express>express();
    app.config = config;

    if (config.helmet) {
        app.use(helmet(config.helmet));
    }

    if (config.firebase) {
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
        const sessionOptions: Data = {
            resave: false,
            saveUninitialized: false
        };
        if (config.session.firestoreCollection && app.locals.firestore) {
            sessionOptions.store = new (FirestoreStore(session))({
                database: app.locals.firestore,
                collection: config.session.firestoreCollection,
            });
        }
        app.set('trust proxy', 1);
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
        app.use(<any>sanitize);
    }

    if (config.models) {
        app.use(<any>models(config.models));
    }

    if (config.routes) {
        app.use(<any>routes({
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
