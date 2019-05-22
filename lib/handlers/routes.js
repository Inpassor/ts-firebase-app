"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const helpers_1 = require("../helpers");
const methods = [
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
exports.routes = (options) => {
    return (request, response, next) => {
        const _routes = options.routes || [];
        for (let i = 0, l = _routes.length; i < l; i++) {
            const route = _routes[i];
            const component = new route.component({
                request,
                response,
                firebaseApp: request.app.locals.firebaseApp,
                firestore: request.app.locals.firestore,
            });
            for (let j = 0, k = methods.length; j < k; j++) {
                const method = methods[j];
                const action = component[method];
                if (request.app[method] && action) {
                    request.app[method](route.path, (_request, _response, _next) => {
                        _request.authType = route.authType === undefined ? options.authType : route.authType;
                        _request.validateHeaders = route.validateHeaders === undefined ?
                            options.validateHeaders : route.validateHeaders;
                        Promise.resolve(helpers_1.validateHeaders(_request, _request.app.locals.firebaseApp, _request.app.locals.firestore))
                            .then((isValid) => {
                            if (isValid) {
                                component.init({
                                    request: _request,
                                    response: _response,
                                });
                                setTimeout(() => {
                                    action.call(component, _next);
                                }, 0);
                            }
                            else {
                                _response.sendStatus(403);
                            }
                        })
                            .catch((error) => {
                            throw new Error(error);
                        });
                    });
                }
            }
        }
        next();
    };
};
//# sourceMappingURL=routes.js.map