import {ExpressRequest} from '../interfaces';
import {AWS4} from '@inpassor/functions';

export const validateAWS4 = (request: ExpressRequest): boolean => {
    const config = request.app.config;
    if (config && config.aws && config.aws.appSync) {
        const authorizationHeader = config.aws.appSync.authHeaderName
            ? <string>(request.headers[config.aws.appSync.authHeaderName] || '')
            : request.headers.authorization || '';
        return AWS4.validateAuthorizationHeader(
            authorizationHeader,
            AWS4.getAmzDate(request.headers),
            request.rawBody,
            config.aws.appSync.accessKeyId,
            config.aws.appSync.region
        );
    }
    return false;
};
