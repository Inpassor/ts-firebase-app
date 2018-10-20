import {
    ExpressRequest,
    ExpressResponse,
} from '../interfaces';

export const sanitize = (request: ExpressRequest, response: ExpressResponse, next: () => void): void => {
    if (request.sanitize) {
        const sanitizeData = (source: string): void => {
            for (const key in request[source]) {
                try {
                    if (request[source].hasOwnProperty(key) && typeof request[source][key] === 'string') {
                        request[source][key] = request.sanitize(request[source][key]);
                    }
                } catch (e) {
                }
            }
        };
        for (const s of ['query', 'params', 'body']) {
            sanitizeData(s);
        }
    }
    next();
};
