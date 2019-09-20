import { Model } from '../model';
import { AppConfigCache } from './app-config-cache';
import { AppConfigFirebase } from './app-config-firebase';
import { AuthType } from './auth-type';
import { BodyParserBasicOptions } from './body-parser-basic-options';
import { BodyParserJsonOptions } from './body-parser-json-options';
import { BodyParserTextOptions } from './body-parser-text-options';
import { BodyParserUrlencodedOptions } from './body-parser-urlencoded-options';
import { CorsOptions } from './cors-options';
import { CorsOptionsDelegate } from './cors-options-delegate';
import { ExpressRequest } from './express-request';
import { Route } from './route';
import { ValidateHeadersFunction } from './validate-headers-function';
export interface AppConfig {
    authType?: AuthType | number;
    validateHeaders?: false | ValidateHeadersFunction;
    routes?: Route[];
    viewsPath?: string;
    viewsExtension?: string;
    models?: {
        [key: string]: typeof Model;
    };
    sentry?: {
        dsn: string;
    };
    helmet?: {
        [key: string]: any;
    };
    cache?: AppConfigCache;
    firebase?: AppConfigFirebase;
    session?: {
        secret: string;
        resave: boolean;
        saveUninitialized: boolean;
        name?: string;
        cookie?: {
            domain?: string;
            expires?: Date;
            httpOnly?: boolean;
            maxAge?: number;
            path?: string;
            sameSite?: boolean | 'lax' | 'strict';
            secure?: boolean;
        };
        genid?: (request: ExpressRequest) => string;
        proxy?: boolean;
        rolling?: boolean;
        firestoreCollection?: string;
        unset?: 'destroy' | 'keep';
        store?: any;
    };
    cors?: CorsOptions | CorsOptionsDelegate;
    cookieParser?: {
        secret?: string | string[];
        options?: {
            decode: Function;
        };
    };
    bodyParser?: {
        raw?: BodyParserBasicOptions;
        json?: BodyParserJsonOptions;
        text?: BodyParserTextOptions;
        urlencoded?: BodyParserUrlencodedOptions;
    };
    sanitizer?: {};
    bearer?: {
        token: string;
        authHeaderName?: string;
    };
    aws?: {
        appSync?: {
            accessKeyId: string;
            region: string;
            authHeaderName?: string;
            authDateHeaderName?: string;
            validateBody?: boolean;
        };
    };
    [key: string]: any;
}
