import {AWS4} from '@inpassor/functions';
import {ExpressRequest} from '../interfaces';

export const validateAWS4 = (request: ExpressRequest): boolean => {
    const config = request.app.config;
    if (config && config.aws && config.aws.appSync) {
        const authorizationHeader = config.aws.appSync.authHeaderName
            ? (request.headers[config.aws.appSync.authHeaderName] || '') as string
            : request.headers.authorization || '';
        return AWS4.validateAuthorizationHeader(
            authorizationHeader,
            (request.headers[config.aws.appSync.authDateHeaderName || 'x-amz-date'] || '') as string,
            (config.aws.appSync.validateBody === undefined || config.aws.appSync.validateBody) ?
                request.rawBody.toString()
                : '',
            config.aws.appSync.accessKeyId,
            config.aws.appSync.region
        );
    }
    return false;
};
