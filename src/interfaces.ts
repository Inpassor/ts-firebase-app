import * as admin from 'firebase-admin';
import * as express from 'express';
import * as Session from 'express-session/session/session';

import {Component} from './component';
import {Model} from './model';

export interface Data {
    [key: string]: any;
}

export type PathParams = string | RegExp | Array<string | RegExp>;

export interface Express extends express.Express {
    config: AppConfig;
}

export enum AuthType {
    none,
    bearer,
    aws4,
}

export interface BodyParserBasicOptions {
    inflate?: boolean; // Defaults to true
    limit?: number | string; // Defaults to '100kb'
    type?: string | string[] | ((request: express.Request) => boolean); // Defaults to application/json
    verify?: (request: express.Request, response: express.Response, buffer: Buffer, encoding: string) => void; // Defaults to undefined
}

export interface BodyParserJsonOptions extends BodyParserBasicOptions {
    reviver?: (key: string, value: any) => any;
    strict?: boolean; // Defaults to true
}

export interface BodyParserTextOptions extends BodyParserBasicOptions {
    defaultCharset?: string; // Defaults to utf-8
}

export interface BodyParserUrlencodedOptions extends BodyParserBasicOptions {
    extended: boolean;
    parameterLimit?: number; // Defaults to 1000
}

export interface AppConfigFirebase {
    timestampsInSnapshots: boolean;
    projectId?: string;
    keyFilename?: string;
    databaseAuthVariableOverride?: Object;
    databaseURL?: string;
    serviceAccountId?: string;
    storageBucket?: string;
}

export interface AppConfig {
    authType?: AuthType | number;
    routes?: Route[];
    models?: { [key: string]: typeof Model };
    helmet?: {};
    session?: {
        name: string;
        secret: string;
        resave: boolean;
        saveUninitialized: boolean;
    };
    cors?: {};
    cookieParser?: {};
    bodyParser?: {
        raw?: BodyParserBasicOptions;
        json?: BodyParserJsonOptions;
        text?: BodyParserTextOptions;
        urlencoded?: BodyParserUrlencodedOptions;
    };
    sanitizer?: {};
    firebase?: AppConfigFirebase;
    aws?: {
        appSync?: {
            accessKeyId: string;
            region: string;
            authHeaderName?: string;
        },
    };
}

export interface ExpressRequest extends express.Request {
    app: Express,
    firebaseApp: admin.app.App;
    firestore: Firestore;
    session: Session;
    authType?: AuthType | number;
    sanitize?: (value: any) => any;
    models?: { [key: string]: typeof Model };
}

export interface ExpressResponse extends express.Response {
}

export interface Route {
    path: PathParams;
    component: typeof Component;
    authType?: AuthType | number;
}

export interface Firestore extends admin.firestore.Firestore {
}

export class FirestoreTimestamp extends admin.firestore.Timestamp {
}

export interface FirestoreFieldPath extends admin.firestore.FieldPath {
}

export type FirestoreWhereFilterOp = '<' | '<=' | '==' | '>=' | '>' | 'array-contains';
export type FirestoreOrderByDirection = 'desc' | 'asc';
export type FirestoreDocumentChangeType = 'added' | 'removed' | 'modified';

export interface FirestoreDocumentReference extends admin.firestore.DocumentReference {
}

export interface FirestoreDocumentSnapshot extends admin.firestore.DocumentSnapshot {
    readonly exists: boolean;
    readonly ref: FirestoreDocumentReference;
    readonly id: string;
    readonly createTime?: FirestoreTimestamp;
    readonly updateTime?: FirestoreTimestamp;
    readonly readTime: FirestoreTimestamp;
    data: () => Data | undefined;
    get: (fieldPath: string | FirestoreFieldPath) => any;
    isEqual: (other: FirestoreDocumentSnapshot) => boolean;
}

export interface FirestoreDocumentChange {
    readonly type: FirestoreDocumentChangeType;
    readonly doc: FirestoreQueryDocumentSnapshot;
    readonly oldIndex: number;
    readonly newIndex: number;
    isEqual: (other: FirestoreDocumentChange) => boolean;
}

export interface FirestoreQuery extends admin.firestore.Query {
    readonly firestore: Firestore;
    where: (fieldPath: string | FirestoreFieldPath, opStr: FirestoreWhereFilterOp, value: any) => FirestoreQuery;
    orderBy: (fieldPath: string | FirestoreFieldPath, directionStr?: FirestoreOrderByDirection) => FirestoreQuery;
    limit: (limit: number) => FirestoreQuery;
    offset: (offset: number) => FirestoreQuery;
    select: (...field: (string | FirestoreFieldPath)[]) => FirestoreQuery;
    startAt: (snapshot: FirestoreDocumentSnapshot, ...fieldValues: any[]) => FirestoreQuery;
    startAfter: (snapshot: FirestoreDocumentSnapshot, ...fieldValues: any[]) => FirestoreQuery;
    endBefore: (snapshot: FirestoreDocumentSnapshot, ...fieldValues: any[]) => FirestoreQuery;
    endAt: (snapshot: FirestoreDocumentSnapshot, ...fieldValues: any[]) => FirestoreQuery;
    get: () => Promise<FirestoreQuerySnapshot>;
    stream: () => NodeJS.ReadableStream;
    onSnapshot: (onNext: (snapshot: FirestoreQuerySnapshot) => void, onError?: (error: Error) => void) => () => void;
    isEqual: (other: FirestoreQuery) => boolean;
}

export interface FirestoreCollectionReference extends FirestoreQuery {
    readonly id: string;
    readonly parent: FirestoreDocumentReference | null;
    readonly path: string;
    doc: (documentPath?: string) => FirestoreDocumentReference;
    add: (data: Data) => Promise<FirestoreDocumentReference>;
    isEqual: (other: FirestoreCollectionReference) => boolean;
}

export interface FirestoreQuerySnapshot extends admin.firestore.QuerySnapshot {
    readonly query: FirestoreQuery;
    readonly docChanges: FirestoreDocumentChange[];
    readonly docs: FirestoreQueryDocumentSnapshot[];
    readonly size: number;
    readonly empty: boolean;
    readonly readTime: FirestoreTimestamp;
    forEach: (callback: (result: FirestoreQueryDocumentSnapshot) => void, thisArg?: any) => void;
    isEqual: (other: FirestoreQuerySnapshot) => boolean;
}

export interface FirestoreQueryDocumentSnapshot extends FirestoreDocumentSnapshot {
    readonly createTime: FirestoreTimestamp;
    readonly updateTime: FirestoreTimestamp;
    data: () => Data;
}

export interface FirestoreSetOptions {
    readonly merge?: boolean;
    readonly mergeFields?: (string | FirestoreFieldPath)[];
}

export interface FirestorePrecondition {
    readonly lastUpdateTime?: FirestoreTimestamp;
}

export interface FirestoreTransaction {
    get: (queryOrDocumentRef: FirestoreQuery | FirestoreDocumentReference) => Promise<FirestoreQuerySnapshot | FirestoreDocumentSnapshot>;
    getAll: (...documentRef: FirestoreDocumentReference[]) => Promise<FirestoreQuerySnapshot[]>;
    create: (documentRef: FirestoreDocumentReference, data: Data) => FirestoreTransaction;
    set: (documentRef: FirestoreDocumentReference, data: Data, options?: FirestoreSetOptions) => FirestoreTransaction;
    update: (documentRef: FirestoreDocumentReference,
             dataOrField: string | FirestoreFieldPath | Data,
             preconditionOrValue?: FirestorePrecondition | any,
             ...fieldsOrPrecondition: any[]) => FirestoreTransaction;
    delete: (documentRef: FirestoreDocumentReference, precondition?: FirestorePrecondition) => FirestoreTransaction;
}

export class FirestoreWriteResult {
    readonly writeTime: FirestoreTimestamp;
    isEqual: (other: FirestoreWriteResult) => boolean;
}

export interface FirestoreWriteBatch {
    create: (documentRef: FirestoreDocumentReference, data: Data) => FirestoreWriteBatch;
    set: (documentRef: FirestoreDocumentReference, data: Data, options?: FirestoreSetOptions) => FirestoreWriteBatch;
    update: (documentRef: FirestoreDocumentReference,
             dataOrField: string | FirestoreFieldPath | Data,
             preconditionOrValue?: FirestorePrecondition | any,
             ...fieldsOrPrecondition: any[]) => FirestoreWriteBatch;
    delete: (documentRef: FirestoreDocumentReference, precondition?: FirestorePrecondition) => FirestoreWriteBatch;
    commit: () => Promise<FirestoreWriteResult[]>;
}

export interface ComponentAction {
    (next?: () => void): void;
}

export interface ComponentOptions {
    request: ExpressRequest;
    response: ExpressResponse;
    firestore?: Firestore;
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
    // transaction: (updateFunction: <T>(transaction: FirestoreTransaction) => Promise<T>) => Promise<any>;
    // batch: () => FirestoreWriteBatch;
    sendError: (error: any) => void;

    /* static */
    getCodeFromError: (error: any) => number;
    getBodyFromError: (error: any) => any;

    [key: string]: any;
}

export interface ModelSchema {
    [key: string]: ModelFieldSchema | ModelFieldType;
}

export enum ModelFieldType {
    none,
    id,
    string,
    boolean,
    bytes,
    geopoint,
    number,
    date,
    array,
    null,
    object,
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
    firestore: Firestore;
    collection: string;
    schema: ModelSchema;
    modelName?: string;
}

export interface IModel extends ModelOptions {
    fieldNames: string[];
    collectionReference: FirestoreCollectionReference;
    documentReference: FirestoreDocumentReference;
    exists: boolean;
    createTime: FirestoreTimestamp;
    updateTime: FirestoreTimestamp;
    readTime: FirestoreTimestamp;
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
    update: (values?: Data) => Promise<FirestoreWriteResult>;
    setFromSnapshot: (snapshot: FirestoreDocumentSnapshot) => boolean;
    collectionReferenceError: (reject: (reason?: any) => void) => void;

    /* static */
    create: <T extends Model>(modelName_or_id?: string, id?: string) => Promise<T>;
    add: <T extends Model>(id: string, values: Data) => Promise<T>;
    find: <T extends Model>(id_or_fieldName?: string, opStr?: FirestoreWhereFilterOp, value?: any) => Promise<T | T[]>;
    findById: <T extends Model>(id: string) => Promise<T>;
    findWhere: <T extends Model>(fieldName: string, opStr: FirestoreWhereFilterOp, value: any) => Promise<T>;
    findAll: <T extends Model>() => Promise<T[]>;

    [key: string]: any;
}
