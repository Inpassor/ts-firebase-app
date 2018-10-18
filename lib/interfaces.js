"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require("firebase-admin");
var AuthType;
(function (AuthType) {
    AuthType[AuthType["none"] = 0] = "none";
    AuthType[AuthType["bearer"] = 1] = "bearer";
    AuthType[AuthType["aws4"] = 2] = "aws4";
})(AuthType = exports.AuthType || (exports.AuthType = {}));
class FirestoreTimestamp extends admin.firestore.Timestamp {
}
exports.FirestoreTimestamp = FirestoreTimestamp;
class FirestoreWriteResult {
}
exports.FirestoreWriteResult = FirestoreWriteResult;
var ModelFieldType;
(function (ModelFieldType) {
    ModelFieldType[ModelFieldType["none"] = 0] = "none";
    ModelFieldType[ModelFieldType["id"] = 1] = "id";
    ModelFieldType[ModelFieldType["string"] = 2] = "string";
    ModelFieldType[ModelFieldType["boolean"] = 3] = "boolean";
    ModelFieldType[ModelFieldType["bytes"] = 4] = "bytes";
    ModelFieldType[ModelFieldType["geopoint"] = 5] = "geopoint";
    ModelFieldType[ModelFieldType["number"] = 6] = "number";
    ModelFieldType[ModelFieldType["date"] = 7] = "date";
    ModelFieldType[ModelFieldType["array"] = 8] = "array";
    ModelFieldType[ModelFieldType["null"] = 9] = "null";
    ModelFieldType[ModelFieldType["object"] = 10] = "object";
})(ModelFieldType = exports.ModelFieldType || (exports.ModelFieldType = {}));
//# sourceMappingURL=interfaces.js.map