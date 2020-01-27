import * as admin from 'firebase-admin';
import {isEmpty} from '@inpassor/functions';

import {
    Data,
    ExpressRequest,
    ExpressResponse,
    FirestoreWhereFilterOp,
    Model as IModel,
    ModelOptions,
    ModelSchema,
    ModelFieldSchema,
    isModelFieldSchema,
    ModelFieldType,
} from './interfaces';

export class Model implements IModel {

    public static modelName = '';
    public modelName = '';
    public static request: ExpressRequest = null;
    public request: ExpressRequest = null;
    public static response: ExpressResponse = null;
    public response: ExpressResponse = null;
    public static firestore: admin.firestore.Firestore = null;
    public firestore: admin.firestore.Firestore = null;

    public static collection = '';
    public collection = '';
    public static schema: ModelSchema = {};
    public schema: ModelSchema = {};

    public collectionReference: admin.firestore.CollectionReference = null;
    public documentReference: admin.firestore.DocumentReference = null;
    public exists = true;
    public createTime: admin.firestore.Timestamp = null;
    public updateTime: admin.firestore.Timestamp = null;
    public readTime: admin.firestore.Timestamp = null;

    private _idSchema: ModelFieldSchema = null;
    private _schema: { [key: string]: ModelFieldSchema } = {};
    private _fieldNames: string[] = null;
    private _originalData: Data = {};
    private _data: Data = {};
    private _writeResult: admin.firestore.WriteResult = null;

    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any

    constructor(options: ModelOptions) {
        this.init(options);
        return new Proxy(this, this);
    }

    public init(options: ModelOptions): void {
        setTimeout(() => {
            Object.assign(this, options);
            if (!this.modelName) {
                this.modelName = this.constructor.name;
            }
            this._normalizeSchema();
            if (this.firestore && this.collection) {
                this.collectionReference = this.firestore.collection(this.collection);
            }
        }, 0);
    }

    public get fieldNames(): string[] {
        if (!this._fieldNames) {
            this._fieldNames = this._schema && Object.keys(this._schema) || [];
        }
        return this._fieldNames;
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public set(target: Model, key: string, value: any): boolean {
        if (target.hasOwnProperty(key)) {
            target[key] = value;
            return true;
        }
        const fieldNames = target.fieldNames;
        if (fieldNames.indexOf(key) !== -1 && target.setValue) {
            return target.setValue(key, value);
        }
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public setValue(fieldName: string, value: any, storeToOriginal = false): boolean {
        const schema = this._schema[fieldName];
        if (schema) {
            if (!schema.validate || schema.validate(value)) {
                if (schema.set && !schema.set(value)) {
                    return false;
                }
                if (storeToOriginal) {
                    this._originalData[fieldName] = value;
                }
                this._data[fieldName] = value;
                return true;
            }
        }
        return false;
    }

    public setValues(values: Data, storeToOriginal = false): boolean {
        if (values && Object.keys(values).length) {
            for (const fieldName in values) {
                if (values.hasOwnProperty(fieldName)) {
                    if (!this.setValue(fieldName, values[fieldName], storeToOriginal)) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }

    public deleteField(fieldName: string): boolean {
        const schema = this._schema[fieldName];
        if (schema) {
            this._data[fieldName] = admin.firestore.FieldValue.delete();
            return true;
        }
        return false;
    }

    public deleteFields(fieldNames: string[]): boolean {
        for (const fieldName of fieldNames) {
            if (!this.deleteField(fieldName)) {
                return false;
            }
        }
        return true;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public get(target: Model, key: string): any {
        if (target[key] !== undefined) {
            return target[key];
        }
        const fieldNames = target.fieldNames || [];
        if (fieldNames.indexOf(key) !== -1 && target.getValue) {
            return target.getValue(key);
        }
        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getValue(fieldName: string): any {
        const schema = this._schema[fieldName];
        if (schema) {
            const value = schema.get ? schema.get() : this._data[fieldName];
            return value === admin.firestore.FieldValue.delete() ? undefined : value;
        }
        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public getValueForUpdate(fieldName: string): any {
        const schema = this._schema[fieldName];
        if (schema) {
            const value = schema.get ? schema.get() : this._data[fieldName];
            const originalValue = this._originalData[fieldName];
            return value === originalValue ? undefined : value;
        }
        return undefined;
    }

    public getValues(fieldNames?: string[]): Data {
        const data: Data = {};
        const _fieldNames = (fieldNames && fieldNames.length) ? fieldNames : this.fieldNames;
        for (const fieldName of _fieldNames) {
            data[fieldName] = this.getValue(fieldName);
        }
        return data;
    }

    public getValuesForUpdate(): Data {
        const data: Data = {};
        if (this._idSchema) {
            const idKey = this._idSchema.key;
            for (const fieldName of this.fieldNames) {
                if (fieldName !== idKey) {
                    const value = this.getValueForUpdate(fieldName);
                    if (value !== undefined) {
                        data[fieldName] = value;
                    }
                }
            }
        }
        return data;
    }

    public setId(id: string): boolean {
        const idKey = this._idSchema && this._idSchema.key;
        if (idKey) {
            return this.setValue(idKey, id);
        }
        return false;
    }

    public getId(): string {
        if (this._idSchema) {
            const id = this.getValue(this._idSchema.key);
            if (!id) {
                throw new Error(`The field "${this._idSchema.key}" of the model "${this.modelName}" is undefined`);
            }
            return id;
        } else {
            throw new Error(`The Schema of the model "${this.modelName}" has no field of the type ID`);
        }
    }

    public update(values?: Data): Promise<admin.firestore.WriteResult> {
        return new Promise((resolve, reject) => {
            if (this.documentReference) {
                if (isEmpty(values) || this.setValues(values)) {
                    this.documentReference.update(this.getValuesForUpdate()).then((writeResult) => {
                        resolve(this._normalizeWriteResult(writeResult));
                    }, (error) => reject(error));
                } else {
                    reject(`Cannot update values for the model "${this.modelName}"`);
                }
            } else {
                reject(`Cannot update the model "${this.modelName}"`);
            }
        });
    }

    public setFromSnapshot(snapshot: admin.firestore.DocumentSnapshot | admin.firestore.QueryDocumentSnapshot): boolean {
        this.exists = !!snapshot && !!snapshot.exists;
        if (
            this.exists
            && snapshot.id
            && this.setId(snapshot.id)
            && snapshot.ref
        ) {
            this.documentReference = snapshot.ref;
            if (this.documentReference && this.setValues(snapshot.data(), true)) {
                this.createTime = snapshot.createTime;
                this.updateTime = snapshot.updateTime;
                this.readTime = snapshot.readTime;
                if (this.createTime && this.updateTime && this.readTime) {
                    return true;
                }
            }
        }
        return false;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public collectionReferenceError(reject: (reason?: any) => void): void {
        reject(`Cannot fetch the collection "${this.collection}"`);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static collectionReferenceError(reject: (reason?: any) => void): void {
        reject(`Cannot fetch the collection "${this.collection}"`);
    }

    public create;

    public static create<T extends Model>(modelNameOrId?: string, _id?: string): Promise<T> {
        let modelName = this.modelName || this.name;
        let id: string = null;
        if (typeof modelNameOrId === 'string' && _id) {
            modelName = modelNameOrId;
            id = _id;
        } else if (modelNameOrId && !_id) {
            if (typeof modelNameOrId === 'string') {
                modelName = modelNameOrId || modelName;
            } else {
                id = modelNameOrId;
            }
        }
        return new Promise<T>((resolve, reject) => {
            if (this.request.models && this.request.models[modelName]) {
                const model: T = new this.request.models[modelName]({
                    request: this.request,
                    response: this.response,
                    firestore: this.firestore,
                    collection: this.collection,
                    modelName,
                    schema: this.schema,
                }) as T;
                setTimeout(() => {
                    if (model.collectionReference && !id || id && model.setId(id)) {
                        resolve(model);
                    } else {
                        model.collectionReferenceError(reject);
                    }
                }, 0);
            } else {
                reject(`Cannot fetch the model "${modelName}"`);
            }
        });
    }

    public add;

    public static add<T extends Model>(id: string, values: Data): Promise<T> {
        return this._createAndRun((model: T, resolve, reject) => {
            if (model._idSchema) {
                if (!model._idSchema.validate || model._idSchema.validate(id)) {
                    if (model.collectionReference) {
                        model.documentReference = model.collectionReference.doc(id);
                        if (model.documentReference) {
                            if (!values || model.setValues(values)) {
                                model.setId(id);
                                model.documentReference.set(model.getValuesForUpdate()).then(() => {
                                    resolve(model);
                                }, (error) => reject(error));
                            } else {
                                reject(`Cannot set values for a new model "${this.modelName}"`);
                            }
                        } else {
                            reject(`Cannot fetch a model "${this.modelName}"`);
                        }
                    } else {
                        model.collectionReferenceError(reject);
                    }
                } else {
                    reject({
                        code: 400,
                    });
                }
            } else {
                reject(`The Schema of the model "${this.modelName}" has no field of the type ID`);
            }
        });
    }

    public find;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static find<T extends Model>(idOrFieldName?: string, opStr?: FirestoreWhereFilterOp, value?: any): Promise<T | T[]> {
        if (idOrFieldName && opStr) {
            return this.findWhere<T>(idOrFieldName, opStr, value);
        } else if (typeof idOrFieldName === 'string' && !opStr) {
            return this.findById<T>(idOrFieldName);
        } else {
            return this.findAll();
        }
    }

    public findById;

    public static findById<T extends Model>(id: string): Promise<T> {
        return this._createAndRun((model: T, resolve, reject) => {
            if (model._idSchema) {
                if (!model._idSchema.validate || model._idSchema.validate(id)) {
                    if (model.collectionReference) {
                        model.documentReference = model.collectionReference.doc(id);
                        if (model.documentReference) {
                            model.documentReference.get().then((snapshot: admin.firestore.DocumentSnapshot) => {
                                if (model.setFromSnapshot(snapshot)) {
                                    resolve(model);
                                } else {
                                    reject({
                                        code: 404,
                                    });
                                }
                            }, (error) => reject(error));
                        } else {
                            reject(`Cannot fetch a model "${this.modelName}"`);
                        }
                    } else {
                        model.collectionReferenceError(reject);
                    }
                } else {
                    reject({
                        code: 400,
                    });
                }
            } else {
                reject(`The Schema of the model "${this.modelName}" has no field of the type ID`);
            }
        });
    }

    public findWhere;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public static findWhere<T extends Model>(fieldName: string, opStr: FirestoreWhereFilterOp, value: any): Promise<T> {
        return this._createAndRun((model: T, resolve, reject) => {
            const _fieldName = fieldName.split('.')[0];
            const schema = _fieldName && model._schema && model._schema[_fieldName];
            if (schema) {
                if (!schema.validate || schema.validate(value)) {
                    if (model.collectionReference) {
                        model.collectionReference
                            .where(fieldName, opStr, value)
                            .limit(1)
                            .get().then((querySnapshot: admin.firestore.QuerySnapshot) => {
                            if (querySnapshot) {
                                if (querySnapshot.size) {
                                    let isFound = false;
                                    querySnapshot.forEach((documentSnapshot: admin.firestore.QueryDocumentSnapshot) => {
                                        if (!isFound && model.setFromSnapshot(documentSnapshot)) {
                                            isFound = true;
                                            resolve(model);
                                        } else {
                                            reject({
                                                code: 404,
                                            });
                                        }
                                    });
                                } else {
                                    reject({
                                        code: 404,
                                    });
                                }
                            } else {
                                reject(`Cannot query a model "${model.modelName}"`);
                            }
                        }, (error) => reject(error));
                    } else {
                        model.collectionReferenceError(reject);
                    }
                } else {
                    reject({
                        code: 400,
                    });
                }
            } else {
                reject(`The Schema of the model "${model.modelName}" has no field "${_fieldName}" definition`);
            }
        });
    }

    public findAll;

    public static findAll<T extends Model>(): Promise<T[]> {
        return new Promise((resolve, reject) => {
            if (this.firestore) {
                const collectionReference = this.firestore.collection(this.collection);
                if (collectionReference) {
                    collectionReference.get().then((querySnapshot: admin.firestore.QuerySnapshot) => {
                        if (querySnapshot) {
                            if (querySnapshot.size) {
                                const promises: Promise<T>[] = [];
                                querySnapshot.forEach((documentSnapshot: admin.firestore.QueryDocumentSnapshot) => {
                                    if (documentSnapshot && documentSnapshot.exists) {
                                        promises.push(this._createAndRun((model: T, modelResolve, modelReject) => {
                                            if (model.setFromSnapshot(documentSnapshot)) {
                                                modelResolve(model);
                                            } else {
                                                modelReject({
                                                    code: 404,
                                                });
                                            }
                                        }));
                                    }
                                });
                                Promise.all(promises).then((models: T[]) => {
                                    resolve(models);
                                }, (error) => reject(error));
                            } else {
                                reject({
                                    code: 404,
                                });
                            }
                        } else {
                            reject(`Cannot query a model "${this.modelName}"`);
                        }
                    }, (error) => reject(error));
                } else {
                    this.collectionReferenceError(reject);
                }
            } else {
                reject(`Cannot initiailize Firestore`);
            }
        });
    }

    private static _createAndRun<T extends Model>(callback: (model: T, resolve, reject) => void): Promise<T> {
        return new Promise((resolve, reject) => {
            this.create().then((model: T) => {
                callback.call(this, model, resolve, reject);
            }, (error) => reject(error));
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _normalizeWriteResult(writeResult: any): admin.firestore.WriteResult {
        const result: admin.firestore.WriteResult = writeResult;
        this._writeResult = result;
        return result;
    }

    private static _normalizeElementSchema(key: string, schema: ModelFieldSchema | ModelFieldType): ModelFieldSchema {
        if (schema) {
            if (isModelFieldSchema(schema)) {
                if (!schema.key) {
                    schema.key = key;
                }
                return schema;
            }
            return {
                type: schema,
                key,
            };
        }
        return null;
    }

    private _normalizeSchema(): void {
        this._schema = {};
        if (!this.schema || !Object.keys(this.schema).length) {
            throw new Error(`The Schema of the model ${this.modelName} is empty`);
        }
        for (const key in this.schema) {
            if (this.schema.hasOwnProperty(key)) {
                const schema = Model._normalizeElementSchema(key, this.schema[key]);
                if (schema) {
                    if (schema.type === ModelFieldType.id && !this._idSchema) {
                        this._idSchema = schema;
                    }
                    this._schema[key] = schema;
                }
            }
        }
        if (!this._idSchema) {
            throw new Error(`The Schema of the model ${this.modelName} has no ID field defined`);
        }
    }

}
