"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBearer = (request) => {
    const config = request.app.config;
    if (config.bearer) {
        const authorizationHeader = config.bearer.authHeaderName
            ? (request.headers[config.bearer.authHeaderName] || '')
            : request.headers.authorization || '';
        if (authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.split('Bearer ')[1];
            return token === config.bearer.token;
        }
    }
    return false;
};
//# sourceMappingURL=validate-bearer.js.map