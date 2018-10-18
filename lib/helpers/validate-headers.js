"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interfaces_1 = require("../interfaces");
var validate_bearer_1 = require("./validate-bearer");
var validate_aws4_1 = require("./validate-aws4");
exports.validateHeaders = function (request) {
    var result = !request.authType;
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
    return result;
};
//# sourceMappingURL=validate-headers.js.map