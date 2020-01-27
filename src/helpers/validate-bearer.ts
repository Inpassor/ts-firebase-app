import {ExpressRequest} from '../interfaces';

export const validateBearer = (request: ExpressRequest): boolean => {
    const config = request.app.config;
    if (config.bearer) {
        const authorizationHeader = config.bearer.authHeaderName
            ? (request.headers[config.bearer.authHeaderName] || '') as string
            : request.headers.authorization || '';
        if (authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.split('Bearer ')[1];
            return token === config.bearer.token;
        }
    }
    return false;
};
