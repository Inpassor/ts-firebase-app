import {
    AuthType,
    ExpressRequest,
} from '../interfaces';
import {validateBearer} from './validate-bearer';
import {validateAWS4} from './validate-aws4';

export const validateHeaders = (request: ExpressRequest): boolean => {
    let result = !request.authType;
    if (request.authType) {
        switch (request.authType) {
            case AuthType.bearer:
                result = validateBearer(request);
                break;
            case AuthType.aws4:
                result = validateAWS4(request);
                break;
        }
    }
    if (request.validateHeaders && result) {
        return request.validateHeaders(request);
    }
    return result;
};
