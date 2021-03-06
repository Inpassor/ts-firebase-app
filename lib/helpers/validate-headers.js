"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const interfaces_1 = require("../interfaces");
const validate_bearer_1 = require("./validate-bearer");
const validate_aws4_1 = require("./validate-aws4");
exports.validateHeaders = (request, firebaseApp, firestore) => {
    let result = !request.authType;
    if (request.authType) {
        switch (request.authType) {
            case interfaces_1.AuthType.bearer:
                result = validate_bearer_1.validateBearer(request);
                break;
            case interfaces_1.AuthType.aws4:
                result = validate_aws4_1.validateAWS4(request);
                break;
        }
    }
    if (request.validateHeaders && result) {
        return request.validateHeaders(request, firebaseApp, firestore);
    }
    return result;
};
//# sourceMappingURL=validate-headers.js.map