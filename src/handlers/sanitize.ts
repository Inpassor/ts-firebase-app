import {
    ExpressRequest,
    ExpressResponse,
} from '../interfaces';

export const sanitize = (request: ExpressRequest, response: ExpressResponse, next: () => void): void => {
    if (request.sanitize) {
        const sanitizeData = (source: string): void => {
            if (typeof request[source] === 'string') {
                request[source] = request.sanitize(request[source]);
            } else {
                for (const key in request[source]) {
                    if (request[source].hasOwnProperty(key) && typeof request[source][key] === 'string') {
                        request[source][key] = request.sanitize(request[source][key]);
                    }
                }
            }
        };
        for (const s of ['query', 'params', 'body']) {
            sanitizeData(s);
        }
    }
    next();
};
