import * as admin from 'firebase-admin';
import {Model} from '../model';
import {Data} from './data';
import {FirestoreWhereFilterOp} from './firestore-where-filter-op';
import {ModelOptions} from './model-options';

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
    deleteField: (fieldName: string) => boolean;
    deleteFields: (fieldNames: string[]) => boolean;
    get: (target: Model, key: string) => any;
    getValue: (fieldName: string) => any;
    getValues: (fieldNames?: string[]) => Data;
    getValuesForUpdate: () => Data;
    setId: (id: string) => boolean;
    getId: () => string;
    update: (values?: Data) => Promise<admin.firestore.WriteResult>;
    setFromSnapshot: (snapshot: admin.firestore.DocumentSnapshot) => boolean;
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
