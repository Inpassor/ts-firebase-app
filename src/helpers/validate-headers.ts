import * as admin from 'firebase-admin';
import {
    AuthType,
    ExpressRequest,
    ValidateHeadersFunction,
} from '../interfaces';
import {validateBearer} from './validate-bearer';
import {validateAWS4} from './validate-aws4';

export const validateHeaders: ValidateHeadersFunction = (
    request: ExpressRequest,
    firebaseApp: admin.app.App,
    firestore: admin.firestore.Firestore,
): boolean | Promise<boolean> => {
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
        return request.validateHeaders(request, firebaseApp, firestore);
    }
    return result;
};
