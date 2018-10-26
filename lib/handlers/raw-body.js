"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rawBodyGetter = () => {
    return (request, response, next) => {
        request.rawBody = '';
        request.on('data', (chunk) => {
            request.rawBody += chunk;
        });
        request.on('end', next);
    };
};
//# sourceMappingURL=raw-body.js.map