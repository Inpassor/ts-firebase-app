import * as admin from 'firebase-admin';
import * as express from 'express';
import { Component } from './component';
import { Model } from './model';
export interface Data {
    [key: string]: any;
}
export declare type PathParams = string | RegExp | Array<string | RegExp>;
export interface Express extends express.Express {
    config: AppConfig;
    env: string;
    locals: {
        firebaseApp: admin.app.App;
        firestore: admin.firestore.Firestore;
        [key: string]: any;
    };
}
export declare enum AuthType {
    none = 0,
    bearer = 1,
    aws4 = 2
}
export interface BodyParserBasicOptions {
    inflate?: boolean;
    limit?: number | string;
    type?: string | string[] | ((request: express.Request) => boolean);
    verify?: (request: ExpressRequest, response: ExpressResponse, buffer: Buffer, encoding: string) => void;
}
export interface BodyParserJsonOptions extends BodyParserBasicOptions {
    reviver?: (key: string, value: any) => any;
    strict?: boolean;
}
export interface BodyParserTextOptions extends BodyParserBasicOptions {
    defaultCharset?: string;
}
export interface BodyParserUrlencodedOptions extends BodyParserBasicOptions {
    extended: boolean;
    parameterLimit?: number;
}
export interface AppConfigCache {
    stdTTL?: number;
    checkperiod?: number;
    errorOnMissing?: boolean;
    useClones?: boolean;
    deleteOnExpire?: boolean;
}
export interface AppConfigFirebase {
    timestampsInSnapshots: boolean;
    projectId?: string;
    keyFileName?: string;
    databaseAuthVariableOverride?: Object;
    databaseURL?: string;
    serviceAccountId?: string;
    storageBucket?: string;
}
export declare type CustomOrigin = (requestOrigin: string, callback: (err: Error | null, allow?: boolean) => void) => void;
export interface CorsOptions {
    origin?: boolean | string | RegExp | (string | RegExp)[] | CustomOrigin;
    methods?: string | string[];
    allowedHeaders?: string | string[];
    exposedHeaders?: string | string[];
    credentials?: boolean;
    maxAge?: number;
    preflightContinue?: boolean;
    optionsSuccessStatus?: number;
}
export declare type CorsOptionsDelegate = (req: express.Request, callback: (err: Error | null, options?: CorsOptions) => void) => void;
export interface AppConfig {
    authType?: AuthType | number;
    validateHeaders?: false | ((request: ExpressRequest) => boolean);
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
        genid?: (request: express.Request) => string;
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
}
export interface ExpressRequest extends express.Request {
    app: Express;
    firebaseApp: admin.app.App;
    firestore: admin.firestore.Firestore;
    session?: {
        id: string;
        cookie: {
            expires?: false | Date;
            maxAge?: number;
            originalMaxAge?: number;
        };
        regenerate: (error: any) => void;
        destroy: (error: any) => void;
        reload: (error: any) => void;
        save: (error: any) => void;
        touch: () => void;
        [key: string]: any;
    };
    sessionID?: string;
    authType?: AuthType | number;
    validateHeaders?: false | ((request: ExpressRequest) => boolean);
    rawBody?: Buffer;
    sanitize?: (value: any) => any;
    models?: {
        [key: string]: typeof Model;
    };
}
export interface ExpressResponse extends express.Response {
}
export interface Route {
    path: PathParams;
    component: typeof Component;
    authType?: AuthType | number;
    validateHeaders?: false | ((request: ExpressRequest) => boolean);
}
export declare type FirestoreWhereFilterOp = '<' | '<=' | '==' | '>=' | '>' | 'array-contains';
export interface ComponentAction {
    (next?: () => void): void;
}
export interface ComponentOptions {
    request: ExpressRequest;
    response: ExpressResponse;
    firestore?: admin.firestore.Firestore;
}
export interface IComponent extends ComponentOptions {
    get?: ComponentAction;
    post?: ComponentAction;
    put?: ComponentAction;
    head?: ComponentAction;
    delete?: ComponentAction;
    options?: ComponentAction;
    trace?: ComponentAction;
    copy?: ComponentAction;
    lock?: ComponentAction;
    mkcol?: ComponentAction;
    move?: ComponentAction;
    purge?: ComponentAction;
    propfind?: ComponentAction;
    proppatch?: ComponentAction;
    unlock?: ComponentAction;
    report?: ComponentAction;
    mkactivity?: ComponentAction;
    checkout?: ComponentAction;
    merge?: ComponentAction;
    'm-search'?: ComponentAction;
    notify?: ComponentAction;
    subscribe?: ComponentAction;
    unsubscribe?: ComponentAction;
    patch?: ComponentAction;
    search?: ComponentAction;
    connect?: ComponentAction;
    all?: ComponentAction;
    init: (options: ComponentOptions) => void;
    sendError: (error: any) => void;
    getCodeFromError: (error: any) => number;
    getMessageFromError: (error: any) => any;
    [key: string]: any;
}
export interface ModelSchema {
    [key: string]: ModelFieldSchema | ModelFieldType;
}
export declare enum ModelFieldType {
    none = 0,
    id = 1,
    string = 2,
    boolean = 3,
    bytes = 4,
    geopoint = 5,
    number = 6,
    date = 7,
    array = 8,
    null = 9,
    object = 10
}
export interface ModelFieldSchema {
    type: ModelFieldType;
    key?: string;
    set?: (value: any) => boolean;
    get?: () => any;
    validate?: (value: any) => boolean;
}
export interface ModelOptions {
    request: ExpressRequest;
    response: ExpressResponse;
    firestore: admin.firestore.Firestore;
    collection: string;
    schema: ModelSchema;
    modelName?: string;
}
export interface IModel extends ModelOptions {
    fieldNames: string[];
    collectionReference: admin.firestore.CollectionReference;
    documentReference: admin.firestore.DocumentReference;
    exists: boolean;
    createTime: admin.firestore.Timestamp;
    updateTime: admin.firestore.Timestamp;
    readTime: admin.firestore.Timestamp;
    init: (options: ModelOptions) => void;
    set: (target: Model, key: string, value: any) => boolean;
    setValue: (fieldName: string, value: any) => boolean;
    setValues: (values: Data) => boolean;
    get: (target: Model, key: string) => any;
    getValue: (fieldName: string) => any;
    getValues: (fieldNames?: string[]) => Data;
    getValuesForUpdate: () => Data;
    setId: (id: string) => boolean;
    getId: () => string;
    removeField: (fieldName: string) => boolean;
    update: (values?: Data) => Promise<admin.firestore.WriteResult>;
    setFromSnapshot: (snapshot: admin.firestore.DocumentSnapshot) => boolean;
    collectionReferenceError: (reject: (reason?: any) => void) => void;
    create: <T extends Model>(modelName_or_id?: string, id?: string) => Promise<T>;
    add: <T extends Model>(id: string, values: Data) => Promise<T>;
    find: <T extends Model>(id_or_fieldName?: string, opStr?: FirestoreWhereFilterOp, value?: any) => Promise<T | T[]>;
    findById: <T extends Model>(id: string) => Promise<T>;
    findWhere: <T extends Model>(fieldName: string, opStr: FirestoreWhereFilterOp, value: any) => Promise<T>;
    findAll: <T extends Model>() => Promise<T[]>;
    [key: string]: any;
}
