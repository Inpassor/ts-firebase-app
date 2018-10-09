import * as express from 'express';
import * as helmet from 'helmet';
import * as session from 'express-session';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import * as sanitizer from 'express-sanitizer';

import {
    Express,
    AppConfig
} from './interfaces';
import {
    sanitize,
    firebase,
    models,
    routes,
} from './handlers';

export const expressApp = (config: AppConfig): Express => {
    const app = <Express>express();
    app.config = config;
    if (config.helmet) {
        app.use(helmet(config.helmet));
    }
    if (config.session) {
        app.use(session(config.session));
    }
    if (config.cors) {
        app.use(cors(config.cors));
    }
    if (config.cookieParser) {
        app.use(cookieParser(config.cookieParser));
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
    if (config.firebase) {
        app.use(<any>firebase(config.firebase));
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
    return app;
};
