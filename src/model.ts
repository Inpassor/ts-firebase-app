import * as admin from 'firebase-admin';

import {
    Data,
    ExpressRequest,
    ExpressResponse,
    FirestoreWhereFilterOp,
    IModel,
    ModelOptions,
    ModelSchema,
    ModelFieldSchema,
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
    private _data: Data = {};
    private _writeResult: admin.firestore.WriteResult = null;

    [key: string]: any;

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

    public setValue(fieldName: string, value: any): boolean {
        if (value) {
            const schema = this._schema[fieldName];
            if (schema && (!schema.validate || schema.validate && schema.validate(value))) {
                if (schema.set && !schema.set(value)) {
                    return false;
                }
                this._data[fieldName] = value;
                return true;
            }
        }
        return false;
    }

    public setValues(values: Data): boolean {
        if (values && Object.keys(values).length) {
            for (const fieldName in values) {
                if (values.hasOwnProperty(fieldName)) {
                    if (!this.setValue(fieldName, values[fieldName])) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    }

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

    public getValue(fieldName: string): any {
        const schema = this._schema[fieldName];
        if (schema) {
            return schema.get ? schema.get() : this._data[fieldName] || undefined;
        }
        return undefined;
    }

    public getValues(fieldNames?: string[]): Data {
        const data: Data = {};
        const _fieldNames = fieldNames && fieldNames.length ? fieldNames : this.fieldNames;
        for (const fieldName of _fieldNames) {
            data[fieldName] = this.getValue(fieldName) || null;
        }
        return data;
    }

    public getValuesForUpdate(): Data {
        // TODO: update only fields with changed values
        const data: Data = {};
        if (this._idSchema) {
            const idKey = this._idSchema.key;
            for (const fieldName of this.fieldNames) {
                if (fieldName !== idKey) {
                    const value = this.getValue(fieldName);
                    if (value !== undefined && value !== null) {
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
            const prevId = this.getValue(idKey);
            console.log(prevId);
            console.log(id);
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

    public removeField(fieldName: string): boolean {
        const schema = this._schema[fieldName];
        if (schema) {
            this._data[fieldName] = admin.firestore.FieldValue.delete();
            return true;
        }
        return false;
    }

    public update(values?: Data): Promise<admin.firestore.WriteResult> {
        return new Promise((resolve, reject) => {
            if (this.documentReference) {
                if (!values || values && this.setValues(values)) {
                    this.documentReference.update(this.getValuesForUpdate()).then((writeResult) => {
                        resolve(this._normalizeWriteResult(writeResult));
                    }, (error: any) => reject(error));
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
            if (this.documentReference && this.setValues(snapshot.data())) {
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

    public collectionReferenceError(reject: (reason?: any) => void): void {
        reject(`Cannot fetch the collection "${this.collection}"`);
    }

    public static collectionReferenceError(reject: (reason?: any) => void): void {
        reject(`Cannot fetch the collection "${this.collection}"`);
    }

    public create;

    public static create<T extends Model>(modelName_or_id?: string, _id?: string): Promise<T> {
        let modelName = this.modelName || this.name;
        let id: string = null;
        if (typeof modelName_or_id === 'string' && _id) {
            modelName = modelName_or_id;
            id = _id;
        } else if (modelName_or_id && !_id) {
            if (typeof modelName_or_id === 'string') {
                modelName = modelName_or_id || modelName;
            } else {
                id = modelName_or_id;
            }
        }
        return new Promise<T>((resolve, reject) => {
            if (this.request.models && this.request.models[modelName]) {
                const model: T = <T>new this.request.models[modelName]({
                    request: this.request,
                    response: this.response,
                    firestore: this.firestore,
                    collection: this.collection,
                    modelName,
                    schema: this.schema,
                });
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
                if (!model._idSchema.validate || model._idSchema.validate && model._idSchema.validate(id)) {
                    if (model.collectionReference) {
                        model.documentReference = model.collectionReference.doc(id);
                        if (model.documentReference) {
                            if (!values || values && model.setValues(values)) {
                                model.documentReference.set(model.getValuesForUpdate()).then(() => {
                                    resolve(model);
                                }, (error: any) => reject(error));
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

    public static find<T extends Model>(id_or_fieldName?: string, opStr?: FirestoreWhereFilterOp, value?: any): Promise<T | T[]> {
        if (id_or_fieldName && opStr) {
            return this.findWhere<T>(id_or_fieldName, opStr, value);
        } else if (typeof id_or_fieldName === 'string' && !opStr) {
            return this.findById<T>(id_or_fieldName);
        } else {
            return this.findAll();
        }
    }

    public findById;

    public static findById<T extends Model>(id: string): Promise<T> {
        return this._createAndRun((model: T, resolve, reject) => {
            if (model._idSchema) {
                if (!model._idSchema.validate || model._idSchema.validate && model._idSchema.validate(id)) {
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
                            }, (error: any) => reject(error));
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

    public static findWhere<T extends Model>(fieldName: string, opStr: FirestoreWhereFilterOp, value: any): Promise<T> {
        return this._createAndRun((model: T, resolve, reject) => {
            const _fieldName = fieldName.split('.')[0];
            const schema = _fieldName && model._schema && model._schema[_fieldName];
            if (schema) {
                if (value && !schema.validate || schema.validate && schema.validate(value)) {
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
                        }, (error: any) => reject(error));
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
                                }, (error: any) => reject(error));
                            } else {
                                reject({
                                    code: 404,
                                });
                            }
                        } else {
                            reject(`Cannot query a model "${this.modelName}"`);
                        }
                    }, (error: any) => reject(error));
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
            }, (error: any) => reject(error));
        });
    }

    private _normalizeWriteResult(writeResult: any): admin.firestore.WriteResult {
        const result: admin.firestore.WriteResult = writeResult;
        this._writeResult = result;
        return result;
    }

    private static _normalizeElementSchema(key: string, schema: ModelFieldSchema | ModelFieldType): ModelFieldSchema {
        if (schema) {
            let result = <any>schema;
            if (result.type === undefined) {
                result = {
                    type: <ModelFieldType>schema,
                    key,
                };
            } else {
                result = <ModelFieldSchema>schema;
                if (!result.key) {
                    result.key = key;
                }
            }
            return result;
        }
        return null;
    }

    private _normalizeSchema(): void {
        this._schema = {};
        if (!this.schema || !Object.keys(this.schema).length) {
            throw new Error(`The Schema of the model ${this.modelName} is empty`);
        }
        for (const key in this.schema) {
            const schema = Model._normalizeElementSchema(key, this.schema[key]);
            if (schema) {
                if (schema.type === ModelFieldType.id && !this._idSchema) {
                    this._idSchema = schema;
                }
                this._schema[key] = schema;
            }
        }
        if (!this._idSchema) {
            throw new Error(`The Schema of the model ${this.modelName} has no ID field defined`);
        }
    }

}
