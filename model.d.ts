import { Data, ExpressRequest, ExpressResponse, Firestore, FirestoreCollectionReference, FirestoreDocumentReference, FirestoreDocumentSnapshot, FirestoreQueryDocumentSnapshot, FirestoreTimestamp, FirestoreWriteResult, FirestoreWhereFilterOp, IModel, ModelOptions, ModelSchema } from './interfaces';
export declare class Model implements IModel {
    static modelName: string;
    modelName: string;
    static request: ExpressRequest;
    request: ExpressRequest;
    static response: ExpressResponse;
    response: ExpressResponse;
    static firestore: Firestore;
    firestore: Firestore;
    static collection: string;
    collection: string;
    static schema: ModelSchema;
    schema: ModelSchema;
    collectionReference: FirestoreCollectionReference;
    documentReference: FirestoreDocumentReference;
    exists: boolean;
    createTime: FirestoreTimestamp;
    updateTime: FirestoreTimestamp;
    readTime: FirestoreTimestamp;
    private _idSchema;
    private _schema;
    private _fieldNames;
    private _data;
    private _writeResult;
    [key: string]: any;
    constructor(options: ModelOptions);
    init(options: ModelOptions): void;
    readonly fieldNames: string[];
    set(target: Model, key: string, value: any): boolean;
    setValue(fieldName: string, value: any): boolean;
    setValues(values: Data): boolean;
    get(target: Model, key: string): any;
    getValue(fieldName: string): any;
    getValues(fieldNames?: string[]): Data;
    getValuesForUpdate(): Data;
    setId(id: string): boolean;
    getId(): string;
    removeField(fieldName: string): boolean;
    update(values?: Data): Promise<FirestoreWriteResult>;
    setFromSnapshot(snapshot: FirestoreDocumentSnapshot | FirestoreQueryDocumentSnapshot): boolean;
    collectionReferenceError(reject: (reason?: any) => void): void;
    static collectionReferenceError(reject: (reason?: any) => void): void;
    create: any;
    static create<T extends Model>(modelName_or_id?: string, _id?: string): Promise<T>;
    add: any;
    static add<T extends Model>(id: string, values: Data): Promise<T>;
    find: any;
    static find<T extends Model>(id_or_fieldName?: string, opStr?: FirestoreWhereFilterOp, value?: any): Promise<T | T[]>;
    findById: any;
    static findById<T extends Model>(id: string): Promise<T>;
    findWhere: any;
    static findWhere<T extends Model>(fieldName: string, opStr: FirestoreWhereFilterOp, value: any): Promise<T>;
    findAll: any;
    static findAll<T extends Model>(): Promise<T[]>;
    private static _createAndRun;
    private _normalizeWriteResult;
    private static _normalizeElementSchema;
    private _normalizeSchema;
}
