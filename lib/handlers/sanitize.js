"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = (request, response, next) => {
    if (request.sanitize) {
        const sanitizeData = (source) => {
            for (const key in request[source]) {
                if (request[source].hasOwnProperty(key) && typeof request[source][key] === 'string') {
                    request[source][key] = request.sanitize(request[source][key]);
                }
            }
        };
        for (const s of ['query', 'params', 'body']) {
            sanitizeData(s);
        }
    }
    next();
};
//# sourceMappingURL=sanitize.js.map