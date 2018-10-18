"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBearer = function (request) {
    var authorizationHeader = request.headers.authorization;
    if (authorizationHeader.startsWith('Bearer ')) {
        var token = authorizationHeader.split('Bearer ')[1];
        console.log(token);
        // TODO: validate Bearer token
        return true;
    }
    return false;
};
//# sourceMappingURL=validate-bearer.js.map