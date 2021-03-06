import * as admin from 'firebase-admin';
import * as express from 'express';
import * as Sentry from '@sentry/node';
import * as helmet from 'helmet';
import * as session from 'express-session';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as ejs from 'ejs';
import * as sanitizer from 'express-sanitizer';

import {
    AuthType,
    Express,
    AppConfig,
} from './interfaces';
import {
    sanitize,
    models,
    routes,
} from './handlers';
import {FirestoreStore} from './helpers';

export const expressApp = (config: AppConfig): Express => {
    const app = express() as Express;
    app.config = config;
    app.env = process.env.NODE_ENV;

    if (config.sentry) {
        Sentry.init(config.sentry);
        app.use(Sentry.Handlers.requestHandler() as express.RequestHandler);
    }

    if (config.helmet) {
        app.use(helmet(config.helmet));
    }

    if (config.firebase) {
        const appOptions: {
            projectId?: string;
            credential?: admin.credential.Credential;
            databaseAuthVariableOverride?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
            databaseURL?: string;
            serviceAccountId?: string;
            storageBucket?: string;
        } = {};
        const firestoreOptions: {
            projectId?: string;
            keyFilename?: string;
            timestampsInSnapshots: boolean;
            [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
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
            if (!admin.apps.length) {
                app.locals.firebaseApp = admin.initializeApp(appOptions);
                app.locals.firestore = app.locals.firebaseApp.firestore() || null;
                if (app.locals.firestore) {
                    app.locals.firestore.settings(firestoreOptions);
                }
            } else {
                app.locals.firebaseApp = admin.app();
                app.locals.firestore = admin.firestore(app.locals.firebaseApp);
            }
        }
    }

    if (config.session) {
        const sessionOptions: {
            store?: FirestoreStore;
        } = {};
        if (config.session.firestoreCollection && app.locals.firestore && !config.session.store) {
            sessionOptions.store = new FirestoreStore({
                database: app.locals.firestore,
                collection: config.session.firestoreCollection,
            });
        }
        if (config.session.cookie && config.session.cookie.secure) {
            app.set('trust proxy', 1);
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
        app.use(sanitize);
    }

    if (config.models) {
        app.use(models(config.models));
    }

    if (config.routes) {
        app.use(routes({
            routes: config.routes,
            authType: config.authType || AuthType.none,
            validateHeaders: config.validateHeaders || false,
        }));
    }

    if (config.viewsPath) {
        app.set('views', config.viewsPath);
        app.set('view engine', 'ejs');
        app.engine(config.viewsExtension || 'html', ejs.renderFile);
    }

    if (config.sentry) {
        app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler);
    }

    return app;
};
