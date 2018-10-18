import * as functions from 'firebase-functions';
import { AppConfig } from './interfaces';
export declare const firebaseApp: (config: AppConfig) => functions.HttpsFunction;
