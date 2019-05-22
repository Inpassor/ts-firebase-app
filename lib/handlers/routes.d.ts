import { ExpressRequest, ExpressResponse, Route } from '../interfaces';
import * as admin from 'firebase-admin';
export declare const routes: (options: {
    routes: Route[];
    authType?: number;
    validateHeaders?: false | ((request: ExpressRequest, firebaseApp: admin.app.App, firestore: FirebaseFirestore.Firestore) => boolean);
}) => (request: ExpressRequest, response: ExpressResponse, next: () => void) => void;
