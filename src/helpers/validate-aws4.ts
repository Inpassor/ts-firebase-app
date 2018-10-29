import {AWS4} from '@inpassor/functions';
import {ExpressRequest} from '../interfaces';

export const validateAWS4 = (request: ExpressRequest): boolean => {
    const config = request.app.config;
    if (config && config.aws && config.aws.appSync) {
        const authorizationHeader = config.aws.appSync.authHeaderName
            ? <string>(request.headers[config.aws.appSync.authHeaderName] || '')
            : request.headers.authorization || '';
        return AWS4.validateAuthorizationHeader(
            authorizationHeader,
            <string>(request.headers[config.aws.appSync.authDateHeaderName || 'x-amz-date'] || ''),
            (config.aws.appSync.validateBody === undefined || config.aws.appSync.validateBody) ?
                request.rawBody.toString()
                : '',
            config.aws.appSync.accessKeyId,
            config.aws.appSync.region
        );
    }
    return false;
};
