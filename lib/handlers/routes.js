"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var helpers_1 = require("../helpers");
var methods = [
    'get',
    'post',
    'put',
    'head',
    'delete',
    'options',
    'trace',
    'copy',
    'lock',
    'mkcol',
    'move',
    'purge',
    'propfind',
    'proppatch',
    'unlock',
    'report',
    'mkactivity',
    'checkout',
    'merge',
    'm-search',
    'notify',
    'subscribe',
    'unsubscribe',
    'patch',
    'search',
    'connect',
    'all',
];
exports.routes = function (options) {
    return function (request, response, next) {
        var _routes = options.routes || [];
        var _loop_1 = function (i, l) {
            var route = _routes[i];
            var component = new route.component({
                request: request,
                response: response,
                firestore: request.firestore,
            });
            var _loop_2 = function (j, k) {
                var method = methods[j];
                var action = component[method];
                if (request.app[method] && action) {
                    request.app[method](route.path, function (_request, _response, _next) {
                        _request.authType = route.authType === undefined ? options.authType : route.authType;
                        if (helpers_1.validateHeaders(_request)) {
                            component.init({
                                request: _request,
                                response: _response,
                            });
                            setTimeout(function () {
                                action.call(component, _next);
                            }, 0);
                        }
                        else {
                            _response.sendStatus(403);
                        }
                    });
                }
            };
            for (var j = 0, k = methods.length; j < k; j++) {
                _loop_2(j, k);
            }
        };
        for (var i = 0, l = _routes.length; i < l; i++) {
            _loop_1(i, l);
        }
        next();
    };
};
//# sourceMappingURL=routes.js.map