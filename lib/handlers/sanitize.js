"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitize = function (request, response, next) {
    if (request.sanitize) {
        var sanitizeData = function (source) {
            for (var key in request[source]) {
                if (request[source].hasOwnProperty(key) && typeof request[source][key] === 'string') {
                    request[source][key] = request.sanitize(request[source][key]);
                }
            }
        };
        for (var _i = 0, _a = ['query', 'params', 'body']; _i < _a.length; _i++) {
            var s = _a[_i];
            sanitizeData(s);
        }
    }
    next();
};
//# sourceMappingURL=sanitize.js.map