"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var admin = require("firebase-admin");
var AuthType;
(function (AuthType) {
    AuthType[AuthType["none"] = 0] = "none";
    AuthType[AuthType["bearer"] = 1] = "bearer";
    AuthType[AuthType["aws4"] = 2] = "aws4";
})(AuthType = exports.AuthType || (exports.AuthType = {}));
var FirestoreTimestamp = /** @class */ (function (_super) {
    __extends(FirestoreTimestamp, _super);
    function FirestoreTimestamp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return FirestoreTimestamp;
}(admin.firestore.Timestamp));
exports.FirestoreTimestamp = FirestoreTimestamp;
var FirestoreWriteResult = /** @class */ (function () {
    function FirestoreWriteResult() {
    }
    return FirestoreWriteResult;
}());
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