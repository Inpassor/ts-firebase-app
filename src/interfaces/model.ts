import * as admin from 'firebase-admin';
import {Model} from '../model';
import {Data} from './data';
import {FirestoreWhereFilterOp} from './firestore-where-filter-op';
import {ModelOptions} from './model-options';

export interface Model extends ModelOptions {
    fieldNames: string[];
    collectionReference: admin.firestore.CollectionReference;
    documentReference: admin.firestore.DocumentReference;
    exists: boolean;
    createTime: admin.firestore.Timestamp;
    updateTime: admin.firestore.Timestamp;
    readTime: admin.firestore.Timestamp;
    init: (options: ModelOptions) => void;
    set: (target: Model, key: string, value: any) => boolean; // eslint-disable-line @typescript-eslint/no-explicit-any
    setValue: (fieldName: string, value: any) => boolean; // eslint-disable-line @typescript-eslint/no-explicit-any
    setValues: (values: Data) => boolean;
    deleteField: (fieldName: string) => boolean;
    deleteFields: (fieldNames: string[]) => boolean;
    get: (target: Model, key: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
    getValue: (fieldName: string) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
    getValues: (fieldNames?: string[]) => Data;
    getValuesForUpdate: () => Data;
    setId: (id: string) => boolean;
    getId: () => string;
    update: (values?: Data) => Promise<admin.firestore.WriteResult>;
    setFromSnapshot: (snapshot: admin.firestore.DocumentSnapshot) => boolean;
    collectionReferenceError: (reject: (reason?: any) => void) => void; // eslint-disable-line @typescript-eslint/no-explicit-any

    /* static */
    create: <T extends Model>(modelNameOrId?: string, id?: string) => Promise<T>;
    add: <T extends Model>(id: string, values: Data) => Promise<T>;
    find: <T extends Model>(idOrFieldName?: string, opStr?: FirestoreWhereFilterOp, value?: any) => Promise<T | T[]>; // eslint-disable-line @typescript-eslint/no-explicit-any
    findById: <T extends Model>(id: string) => Promise<T>;
    findWhere: <T extends Model>(fieldName: string, opStr: FirestoreWhereFilterOp, value: any) => Promise<T>; // eslint-disable-line @typescript-eslint/no-explicit-any
    findAll: <T extends Model>() => Promise<T[]>;

    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
