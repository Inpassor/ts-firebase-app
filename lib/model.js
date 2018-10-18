"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
var interfaces_1 = require("./interfaces");
var Model = /** @class */ (function () {
    function Model(options) {
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
        this._data = {};
        this._writeResult = null;
        this.init(options);
        return new Proxy(this, this);
    }
    Model.prototype.init = function (options) {
        var _this = this;
        setTimeout(function () {
            Object.assign(_this, options);
            if (!_this.modelName) {
                _this.modelName = _this.constructor.name;
            }
            _this._normalizeSchema();
            if (_this.firestore && _this.collection) {
                _this.collectionReference = _this.firestore.collection(_this.collection);
            }
        }, 0);
    };
    Object.defineProperty(Model.prototype, "fieldNames", {
        get: function () {
            if (!this._fieldNames) {
                this._fieldNames = this._schema && Object.keys(this._schema) || [];
            }
            return this._fieldNames;
        },
        enumerable: true,
        configurable: true
    });
    ;
    Model.prototype.set = function (target, key, value) {
        if (target.hasOwnProperty(key)) {
            target[key] = value;
            return true;
        }
        var fieldNames = target.fieldNames;
        if (fieldNames.indexOf(key) !== -1 && target.setValue) {
            return target.setValue(key, value);
        }
        return false;
    };
    Model.prototype.setValue = function (fieldName, value) {
        if (value) {
            var schema = this._schema[fieldName];
            if (schema && (!schema.validate || schema.validate && schema.validate(value))) {
                if (schema.set && !schema.set(value)) {
                    return false;
                }
                this._data[fieldName] = value;
                return true;
            }
        }
        return false;
    };
    Model.prototype.setValues = function (values) {
        if (values && Object.keys(values).length) {
            for (var fieldName in values) {
                if (values.hasOwnProperty(fieldName)) {
                    if (!this.setValue(fieldName, values[fieldName])) {
                        return false;
                    }
                }
            }
            return true;
        }
        return false;
    };
    Model.prototype.get = function (target, key) {
        if (target[key] !== undefined) {
            return target[key];
        }
        var fieldNames = target.fieldNames || [];
        if (fieldNames.indexOf(key) !== -1 && target.getValue) {
            return target.getValue(key);
        }
        return undefined;
    };
    Model.prototype.getValue = function (fieldName) {
        var schema = this._schema[fieldName];
        if (schema) {
            return schema.get ? schema.get() : this._data[fieldName] || undefined;
        }
        return undefined;
    };
    Model.prototype.getValues = function (fieldNames) {
        var data = {};
        var _fieldNames = fieldNames && fieldNames.length ? fieldNames : this.fieldNames;
        for (var _i = 0, _fieldNames_1 = _fieldNames; _i < _fieldNames_1.length; _i++) {
            var fieldName = _fieldNames_1[_i];
            data[fieldName] = this.getValue(fieldName) || null;
        }
        return data;
    };
    Model.prototype.getValuesForUpdate = function () {
        // TODO: update only fields with changed values
        var data = {};
        if (this._idSchema) {
            var idKey = this._idSchema.key;
            for (var _i = 0, _a = this.fieldNames; _i < _a.length; _i++) {
                var fieldName = _a[_i];
                if (fieldName !== idKey) {
                    var value = this.getValue(fieldName);
                    if (value !== undefined) {
                        data[fieldName] = value;
                    }
                }
            }
        }
        return data;
    };
    Model.prototype.setId = function (id) {
        var idKey = this._idSchema && this._idSchema.key;
        if (idKey) {
            var prevId = this.getValue(idKey);
            console.log(prevId);
            console.log(id);
            return this.setValue(idKey, id);
        }
        return false;
    };
    Model.prototype.getId = function () {
        if (this._idSchema) {
            var id = this.getValue(this._idSchema.key);
            if (!id) {
                throw new Error("The field \"" + this._idSchema.key + "\" of the model \"" + this.modelName + "\" is undefined");
            }
            return id;
        }
        else {
            throw new Error("The Schema of the model \"" + this.modelName + "\" has no field of the type ID");
        }
    };
    Model.prototype.removeField = function (fieldName) {
        var schema = this._schema[fieldName];
        if (schema) {
            this._data[fieldName] = admin.firestore.FieldValue.delete();
            return true;
        }
        return false;
    };
    Model.prototype.update = function (values) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.documentReference) {
                if (!values || values && _this.setValues(values)) {
                    _this.documentReference.update(_this.getValuesForUpdate()).then(function (writeResult) {
                        resolve(_this._normalizeWriteResult(writeResult));
                    }, function (error) { return reject(error); });
                }
                else {
                    reject("Cannot update values for the model \"" + _this.modelName + "\"");
                }
            }
            else {
                reject("Cannot update the model \"" + _this.modelName + "\"");
            }
        });
    };
    Model.prototype.setFromSnapshot = function (snapshot) {
        this.exists = !!snapshot && !!snapshot.exists;
        if (this.exists
            && snapshot.id
            && this.setId(snapshot.id)
            && snapshot.ref) {
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
    };
    Model.prototype.collectionReferenceError = function (reject) {
        reject("Cannot fetch the collection \"" + this.collection + "\"");
    };
    Model.collectionReferenceError = function (reject) {
        reject("Cannot fetch the collection \"" + this.collection + "\"");
    };
    Model.create = function (modelName_or_id, _id) {
        var _this = this;
        var modelName = this.modelName || this.name;
        var id = null;
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
        return new Promise(function (resolve, reject) {
            if (_this.request.models && _this.request.models[modelName]) {
                var model_1 = new _this.request.models[modelName]({
                    request: _this.request,
                    response: _this.response,
                    firestore: _this.firestore,
                    collection: _this.collection,
                    modelName: modelName,
                    schema: _this.schema,
                });
                setTimeout(function () {
                    if (model_1.collectionReference && !id || id && model_1.setId(id)) {
                        resolve(model_1);
                    }
                    else {
                        model_1.collectionReferenceError(reject);
                    }
                }, 0);
            }
            else {
                reject("Cannot fetch the model \"" + modelName + "\"");
            }
        });
    };
    Model.add = function (id, values) {
        var _this = this;
        return this._createAndRun(function (model, resolve, reject) {
            if (model._idSchema) {
                if (!model._idSchema.validate || model._idSchema.validate && model._idSchema.validate(id)) {
                    if (model.collectionReference) {
                        model.documentReference = model.collectionReference.doc(id);
                        if (model.documentReference) {
                            if (!values || values && model.setValues(values)) {
                                model.documentReference.set(model.getValuesForUpdate()).then(function () {
                                    resolve(model);
                                }, function (error) { return reject(error); });
                            }
                            else {
                                reject("Cannot set values for a new model \"" + _this.modelName + "\"");
                            }
                        }
                        else {
                            reject("Cannot fetch a model \"" + _this.modelName + "\"");
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
                reject("The Schema of the model \"" + _this.modelName + "\" has no field of the type ID");
            }
        });
    };
    Model.find = function (id_or_fieldName, opStr, value) {
        if (id_or_fieldName && opStr) {
            return this.findWhere(id_or_fieldName, opStr, value);
        }
        else if (typeof id_or_fieldName === 'string' && !opStr) {
            return this.findById(id_or_fieldName);
        }
        else {
            return this.findAll();
        }
    };
    Model.findById = function (id) {
        var _this = this;
        return this._createAndRun(function (model, resolve, reject) {
            if (model._idSchema) {
                if (!model._idSchema.validate || model._idSchema.validate && model._idSchema.validate(id)) {
                    if (model.collectionReference) {
                        model.documentReference = model.collectionReference.doc(id);
                        if (model.documentReference) {
                            model.documentReference.get().then(function (snapshot) {
                                if (model.setFromSnapshot(snapshot)) {
                                    resolve(model);
                                }
                                else {
                                    reject({
                                        code: 404,
                                    });
                                }
                            }, function (error) { return reject(error); });
                        }
                        else {
                            reject("Cannot fetch a model \"" + _this.modelName + "\"");
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
                reject("The Schema of the model \"" + _this.modelName + "\" has no field of the type ID");
            }
        });
    };
    Model.findWhere = function (fieldName, opStr, value) {
        return this._createAndRun(function (model, resolve, reject) {
            var _fieldName = fieldName.split('.')[0];
            var schema = _fieldName && model._schema && model._schema[_fieldName];
            if (schema) {
                if (value && !schema.validate || schema.validate && schema.validate(value)) {
                    if (model.collectionReference) {
                        model.collectionReference
                            .where(fieldName, opStr, value)
                            .limit(1)
                            .get().then(function (querySnapshot) {
                            if (querySnapshot) {
                                if (querySnapshot.size) {
                                    var isFound_1 = false;
                                    querySnapshot.forEach(function (documentSnapshot) {
                                        if (!isFound_1 && model.setFromSnapshot(documentSnapshot)) {
                                            isFound_1 = true;
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
                                reject("Cannot query a model \"" + model.modelName + "\"");
                            }
                        }, function (error) { return reject(error); });
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
                reject("The Schema of the model \"" + model.modelName + "\" has no field \"" + _fieldName + "\" definition");
            }
        });
    };
    Model.findAll = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (_this.firestore) {
                var collectionReference = _this.firestore.collection(_this.collection);
                if (collectionReference) {
                    collectionReference.get().then(function (querySnapshot) {
                        if (querySnapshot) {
                            if (querySnapshot.size) {
                                var promises_1 = [];
                                querySnapshot.forEach(function (documentSnapshot) {
                                    if (documentSnapshot && documentSnapshot.exists) {
                                        promises_1.push(_this._createAndRun(function (model, modelResolve, modelReject) {
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
                                Promise.all(promises_1).then(function (models) {
                                    resolve(models);
                                }, function (error) { return reject(error); });
                            }
                            else {
                                reject({
                                    code: 404,
                                });
                            }
                        }
                        else {
                            reject("Cannot query a model \"" + _this.modelName + "\"");
                        }
                    }, function (error) { return reject(error); });
                }
                else {
                    _this.collectionReferenceError(reject);
                }
            }
            else {
                reject("Cannot initiailize Firestore");
            }
        });
    };
    Model._createAndRun = function (callback) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            _this.create().then(function (model) {
                callback.call(_this, model, resolve, reject);
            }, function (error) { return reject(error); });
        });
    };
    Model.prototype._normalizeWriteResult = function (writeResult) {
        var result = writeResult;
        this._writeResult = result;
        return result;
    };
    Model._normalizeElementSchema = function (key, schema) {
        if (schema) {
            var result = schema;
            if (result.type === undefined) {
                result = {
                    type: schema,
                    key: key,
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
    };
    Model.prototype._normalizeSchema = function () {
        this._schema = {};
        if (!this.schema || !Object.keys(this.schema).length) {
            throw new Error("The Schema of the model " + this.modelName + " is empty");
        }
        for (var key in this.schema) {
            var schema = Model._normalizeElementSchema(key, this.schema[key]);
            if (schema) {
                if (schema.type === interfaces_1.ModelFieldType.id && !this._idSchema) {
                    this._idSchema = schema;
                }
                this._schema[key] = schema;
            }
        }
        if (!this._idSchema) {
            throw new Error("The Schema of the model " + this.modelName + " has no ID field defined");
        }
    };
    Model.modelName = '';
    Model.request = null;
    Model.response = null;
    Model.firestore = null;
    Model.collection = '';
    Model.schema = {};
    return Model;
}());
exports.Model = Model;
//# sourceMappingURL=model.js.map