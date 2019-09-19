import * as express from 'express';
import * as admin from 'firebase-admin';
import {AppConfig} from './app-config';

export interface Express extends express.Express {
    config: AppConfig;
    env: string;
    locals: {
        firebaseApp: admin.app.App;
        firestore: admin.firestore.Firestore;
        [key: string]: any;
    };
}
