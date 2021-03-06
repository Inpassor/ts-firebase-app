"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const functions_1 = require("@inpassor/functions");
exports.validateAWS4 = (request) => {
    const config = request.app.config;
    if (config && config.aws && config.aws.appSync) {
        const authorizationHeader = config.aws.appSync.authHeaderName
            ? (request.headers[config.aws.appSync.authHeaderName] || '')
            : request.headers.authorization || '';
        return functions_1.AWS4.validateAuthorizationHeader(authorizationHeader, (request.headers[config.aws.appSync.authDateHeaderName || 'x-amz-date'] || ''), (config.aws.appSync.validateBody === undefined || config.aws.appSync.validateBody) ?
            request.rawBody.toString()
            : '', config.aws.appSync.accessKeyId, config.aws.appSync.region);
    }
    return false;
};
//# sourceMappingURL=validate-aws4.js.map