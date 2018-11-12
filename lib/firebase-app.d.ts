import * as functions from 'firebase-functions';
import { AppConfig } from './interfaces';
export declare const firebaseApp: (getConfig: AppConfig | Promise<AppConfig>) => functions.HttpsFunction;
