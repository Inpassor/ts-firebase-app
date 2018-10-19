import {
    ExpressRequest,
    ExpressResponse,
    Route,
    AuthType,
    ComponentAction,
} from '../interfaces';
import {validateHeaders} from '../helpers';

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

export const routes = (options: {
    routes: Route[],
    authType?: AuthType | number,
}) => {
    return (request: ExpressRequest, response: ExpressResponse, next: () => void): void => {
        const _routes = options.routes || [];
        for (let i = 0, l = _routes.length; i < l; i++) {
            const route = _routes[i];
            const component = new route.component({
                request,
                response,
                firestore: request.app.locals.firestore,
            });
            for (let j = 0, k = methods.length; j < k; j++) {
                const method = methods[j];
                const action: ComponentAction = component[method];
                if (request.app[method] && action) {
                    request.app[method](route.path, (_request: ExpressRequest, _response: ExpressResponse, _next: () => void): void => {
                        _request.authType = route.authType === undefined ? options.authType : route.authType;
                        if (validateHeaders(_request)) {
                            component.init({
                                request: _request,
                                response: _response,
                            });
                            setTimeout(() => {
                                action.call(component, _next);
                            }, 0);
                        } else {
                            _response.sendStatus(403);
                        }
                    });
                }
            }
        }
        next();
    };
};
