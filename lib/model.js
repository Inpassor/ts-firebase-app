"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
const functions_1 = require("@inpassor/functions");
const interfaces_1 = require("./interfaces");
class Model {
    constructor(options) {
        this.modelName = '';
        this.request = null;
        this.response = null;
        this.firestore = null;
        this.collection = '';
        this.schema = {};
        this.collectionReference = null;
        this.documentReference = null;
        this.exists = true;
        this.createTime = null;
        this.updateTime = null;
        this.readTime = null;
        this._idSchema = null;
        this._schema = {};
        this._fieldNames = null;
        this._originalData = {};
        this._data = {};
        this._writeResult = null;
        this.init(options);
        return new Proxy(this, this);
    }
    init(options) {
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
    get fieldNames() {
        if (!this._fieldNames) {
            this._fieldNames = this._schema && Object.keys(this._schema) || [];
        }
        return this._fieldNames;
    }
    ;
    set(target, key, value) {
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
    setValue(fieldName, value, storeToOriginal = false) {
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
    setValues(values, storeToOriginal = false) {
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
    deleteField(fieldName) {
        const schema = this._schema[fieldName];
        if (schema) {
            this._data[fieldName] = admin.firestore.FieldValue.delete();
            return true;
        }
        return false;
    }
    deleteFields(fieldNames) {
        for (const fieldName of fieldNames) {
            if (!this.deleteField(fieldName)) {
                return false;
            }
        }
        return true;
    }
    get(target, key) {
        if (target[key] !== undefined) {
            return target[key];
        }
        const fieldNames = target.fieldNames || [];
        if (fieldNames.indexOf(key) !== -1 && target.getValue) {
            return target.getValue(key);
        }
        return undefined;
    }
    getValue(fieldName, forUpdate = false) {
        const schema = this._schema[fieldName];
        if (schema) {
            if (schema.get) {
                return schema.get();
            }
            const value = this._data[fieldName];
            if (forUpdate) {
                const originalValue = this._originalData[fieldName];
                if (value === originalValue) {
                    return undefined;
                }
            }
            return value;
        }
        return undefined;
    }
    getValues(fieldNames) {
        const data = {};
        const _fieldNames = fieldNames && fieldNames.length ? fieldNames : this.fieldNames;
        for (const fieldName of _fieldNames) {
            data[fieldName] = this.getValue(fieldName);
        }
        return data;
    }
    getValuesForUpdate() {
        const data = {};
        if (this._idSchema) {
            const idKey = this._idSchema.key;
            for (const fieldName of this.fieldNames) {
                if (fieldName !== idKey) {
                    const value = this.getValue(fieldName, true);
                    if (value !== undefined) {
                        data[fieldName] = value;
                    }
                }
            }
        }
        return data;
    }
    setId(id) {
        const idKey = this._idSchema && this._idSchema.key;
        if (idKey) {
            return this.setValue(idKey, id);
        }
        return false;
    }
    getId() {
        if (this._idSchema) {
            const id = this.getValue(this._idSchema.key);
            if (!id) {
                throw new Error(`The field "${this._idSchema.key}" of the model "${this.modelName}" is undefined`);
            }
            return id;
        }
        else {
            throw new Error(`The Schema of the model "${this.modelName}" has no field of the type ID`);
        }
    }
    update(values) {
        return new Promise((resolve, reject) => {
            if (this.documentReference) {
                if (functions_1.isEmpty(values) || this.setValues(values)) {
                    this.documentReference.update(this.getValuesForUpdate()).then((writeResult) => {
                        resolve(this._normalizeWriteResult(writeResult));
                    }, (error) => reject(error));
                }
                else {
                    reject(`Cannot update values for the model "${this.modelName}"`);
                }
            }
            else {
                reject(`Cannot update the model "${this.modelName}"`);
            }
        });
    }
    setFromSnapshot(snapshot) {
        this.exists = !!snapshot && !!snapshot.exists;
        if (this.exists
            && snapshot.id
            && this.setId(snapshot.id)
            && snapshot.ref) {
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
    collectionReferenceError(reject) {
        reject(`Cannot fetch the collection "${this.collection}"`);
    }
    static collectionReferenceError(reject) {
        reject(`Cannot fetch the collection "${this.collection}"`);
    }
    static create(modelName_or_id, _id) {
        let modelName = this.modelName || this.name;
        let id = null;
        if (typeof modelName_or_id === 'string' && _id) {
            modelName = modelName_or_id;
            id = _id;
        }
        else if (modelName_or_id && !_id) {
            if (typeof modelName_or_id === 'string') {
                modelName = modelName_or_id || modelName;
            }
            else {
                id = modelName_or_id;
            }
        }
        return new Promise((resolve, reject) => {
            if (this.request.models && this.request.models[modelName]) {
                const model = new this.request.models[modelName]({
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
                    }
                    else {
                        model.collectionReferenceError(reject);
                    }
                }, 0);
            }
            else {
                reject(`Cannot fetch the model "${modelName}"`);
            }
        });
    }
    static add(id, values) {
        return this._createAndRun((model, resolve, reject) => {
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
                            }
                            else {
                                reject(`Cannot set values for a new model "${this.modelName}"`);
                            }
                        }
                        else {
                            reject(`Cannot fetch a model "${this.modelName}"`);
                        }
                    }
                    else {
                        model.collectionReferenceError(reject);
                    }
                }
                else {
                    reject({
                        code: 400,
                    });
                }
            }
            else {
                reject(`The Schema of the model "${this.modelName}" has no field of the type ID`);
            }
        });
    }
    static find(id_or_fieldName, opStr, value) {
        if (id_or_fieldName && opStr) {
            return this.findWhere(id_or_fieldName, opStr, value);
        }
        else if (typeof id_or_fieldName === 'string' && !opStr) {
            return this.findById(id_or_fieldName);
        }
        else {
            return this.findAll();
        }
    }
    static findById(id) {
        return this._createAndRun((model, resolve, reject) => {
            if (model._idSchema) {
                if (!model._idSchema.validate || model._idSchema.validate(id)) {
                    if (model.collectionReference) {
                        model.documentReference = model.collectionReference.doc(id);
                        if (model.documentReference) {
                            model.documentReference.get().then((snapshot) => {
                                if (model.setFromSnapshot(snapshot)) {
                                    resolve(model);
                                }
                                else {
                                    reject({
                                        code: 404,
                                    });
                                }
                            }, (error) => reject(error));
                        }
                        else {
                            reject(`Cannot fetch a model "${this.modelName}"`);
                        }
                    }
                    else {
                        model.collectionReferenceError(reject);
                    }
                }
                else {
                    reject({
                        code: 400,
                    });
                }
            }
            else {
                reject(`The Schema of the model "${this.modelName}" has no field of the type ID`);
            }
        });
    }
    static findWhere(fieldName, opStr, value) {
        return this._createAndRun((model, resolve, reject) => {
            const _fieldName = fieldName.split('.')[0];
            const schema = _fieldName && model._schema && model._schema[_fieldName];
            if (schema) {
                if (!schema.validate || schema.validate(value)) {
                    if (model.collectionReference) {
                        model.collectionReference
                            .where(fieldName, opStr, value)
                            .limit(1)
                            .get().then((querySnapshot) => {
                            if (querySnapshot) {
                                if (querySnapshot.size) {
                                    let isFound = false;
                                    querySnapshot.forEach((documentSnapshot) => {
                                        if (!isFound && model.setFromSnapshot(documentSnapshot)) {
                                            isFound = true;
                                            resolve(model);
                                        }
                                        else {
                                            reject({
                                                code: 404,
                                            });
                                        }
                                    });
                                }
                                else {
                                    reject({
                                        code: 404,
                                    });
                                }
                            }
                            else {
                                reject(`Cannot query a model "${model.modelName}"`);
                            }
                        }, (error) => reject(error));
                    }
                    else {
                        model.collectionReferenceError(reject);
                    }
                }
                else {
                    reject({
                        code: 400,
                    });
                }
            }
            else {
                reject(`The Schema of the model "${model.modelName}" has no field "${_fieldName}" definition`);
            }
        });
    }
    static findAll() {
        return new Promise((resolve, reject) => {
            if (this.firestore) {
                const collectionReference = this.firestore.collection(this.collection);
                if (collectionReference) {
                    collectionReference.get().then((querySnapshot) => {
                        if (querySnapshot) {
                            if (querySnapshot.size) {
                                const promises = [];
                                querySnapshot.forEach((documentSnapshot) => {
                                    if (documentSnapshot && documentSnapshot.exists) {
                                        promises.push(this._createAndRun((model, modelResolve, modelReject) => {
                                            if (model.setFromSnapshot(documentSnapshot)) {
                                                modelResolve(model);
                                            }
                                            else {
                                                modelReject({
                                                    code: 404,
                                                });
                                            }
                                        }));
                                    }
                                });
                                Promise.all(promises).then((models) => {
                                    resolve(models);
                                }, (error) => reject(error));
                            }
                            else {
                                reject({
                                    code: 404,
                                });
                            }
                        }
                        else {
                            reject(`Cannot query a model "${this.modelName}"`);
                        }
                    }, (error) => reject(error));
                }
                else {
                    this.collectionReferenceError(reject);
                }
            }
            else {
                reject(`Cannot initiailize Firestore`);
            }
        });
    }
    static _createAndRun(callback) {
        return new Promise((resolve, reject) => {
            this.create().then((model) => {
                callback.call(this, model, resolve, reject);
            }, (error) => reject(error));
        });
    }
    _normalizeWriteResult(writeResult) {
        const result = writeResult;
        this._writeResult = result;
        return result;
    }
    static _normalizeElementSchema(key, schema) {
        if (schema) {
            let result = schema;
            if (result.type === undefined) {
                result = {
                    type: schema,
                    key,
                };
            }
            else {
                result = schema;
                if (!result.key) {
                    result.key = key;
                }
            }
            return result;
        }
        return null;
    }
    _normalizeSchema() {
        this._schema = {};
        if (!this.schema || !Object.keys(this.schema).length) {
            throw new Error(`The Schema of the model ${this.modelName} is empty`);
        }
        for (const key in this.schema) {
            const schema = Model._normalizeElementSchema(key, this.schema[key]);
            if (schema) {
                if (schema.type === interfaces_1.ModelFieldType.id && !this._idSchema) {
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
Model.modelName = '';
Model.request = null;
Model.response = null;
Model.firestore = null;
Model.collection = '';
Model.schema = {};
exports.Model = Model;
//# sourceMappingURL=model.js.map