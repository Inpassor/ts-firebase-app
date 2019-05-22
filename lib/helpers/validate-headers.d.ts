import * as admin from 'firebase-admin';
import { ExpressRequest } from '../interfaces';
export declare const validateHeaders: (request: ExpressRequest, firebaseApp: admin.app.App, firestore: FirebaseFirestore.Firestore) => boolean;
