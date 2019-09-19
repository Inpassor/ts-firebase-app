import * as admin from 'firebase-admin';
import {ExpressRequest} from './express-request';

export interface ValidateHeadersFunction {
    (
        request: ExpressRequest,
        firebaseApp: admin.app.App,
        firestore: admin.firestore.Firestore,
    ): boolean | Promise<boolean>;
}
