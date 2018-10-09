import {ExpressRequest} from '../interfaces';

export const validateBearer = (request: ExpressRequest): boolean => {
    const authorizationHeader = request.headers.authorization;
    if (authorizationHeader.startsWith('Bearer ')) {
        const token = authorizationHeader.split('Bearer ')[1];
        console.log(token);
        // TODO: validate Bearer token
        return true;
    }
    return false;
};
