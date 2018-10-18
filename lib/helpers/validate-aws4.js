"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var aws4_1 = require("@inpassor/functions/lib/aws4");
exports.validateAWS4 = function (request) {
    var config = request.app.config;
    if (config && config.aws && config.aws.appSync) {
        var authorizationHeader = config.aws.appSync.authHeaderName
            ? (request.headers[config.aws.appSync.authHeaderName] || '')
            : request.headers.authorization || '';
        return aws4_1.AWS4.validateAuthorizationHeader(authorizationHeader, aws4_1.AWS4.getAmzDate(request.headers), '', // TODO: get request body and put it here
        config.aws.appSync.accessKeyId, config.aws.appSync.region);
    }
    return false;
};
//# sourceMappingURL=validate-aws4.js.map