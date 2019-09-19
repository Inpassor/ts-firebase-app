import * as admin from 'firebase-admin';
import {ExpressRequest} from './express-request';
import {ExpressResponse} from './express-response';

export interface ComponentOptions {
    request: ExpressRequest;
    response: ExpressResponse;
    firebaseApp?: admin.app.App;
    firestore?: admin.firestore.Firestore;
}
