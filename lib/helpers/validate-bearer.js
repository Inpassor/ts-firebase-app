"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBearer = (request) => {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split('Bearer ')[1];
        const config = request.app.config;
        if (config && config.bearer && config.bearer.token) {
            return token === config.bearer.token;
        }
    }
    return false;
};
//# sourceMappingURL=validate-bearer.js.map