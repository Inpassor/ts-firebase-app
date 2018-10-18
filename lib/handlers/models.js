"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _models = {};
exports.models = function (options) {
    return function (request, response, next) {
        if (!Object.keys(_models).length && options && Object.keys(options).length) {
            for (var modelName in options) {
                _models[modelName] = options[modelName];
                _models[modelName].modelName = modelName;
                _models[modelName].request = request;
                _models[modelName].response = response;
                _models[modelName].firestore = request.firestore;
            }
        }
        request.models = _models;
        next();
    };
};
//# sourceMappingURL=models.js.map