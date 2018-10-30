import {ExpressRequest} from '../interfaces';

export const validateBearer = (request: ExpressRequest): boolean => {
    const config = request.app.config;
    if (config.bearer) {
        const authorizationHeader = config.bearer.authHeaderName
            ? <string>(request.headers[config.bearer.authHeaderName] || '')
            : request.headers.authorization || '';
        if (authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.split('Bearer ')[1];
            return token === config.bearer.token;
        }
    }
    return false;
};
