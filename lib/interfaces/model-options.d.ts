import * as admin from 'firebase-admin';
import { ExpressRequest } from './express-request';
import { ExpressResponse } from './express-response';
import { ModelSchema } from './model-schema';
export interface ModelOptions {
    request: ExpressRequest;
    response: ExpressResponse;
    firestore: admin.firestore.Firestore;
    collection: string;
    schema: ModelSchema;
    modelName?: string;
}
