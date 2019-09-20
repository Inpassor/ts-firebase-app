import { RuntimeOptions, HttpsFunction } from 'firebase-functions';
import { AppConfig } from './interfaces';
export declare const firebaseApp: (getConfig: AppConfig | Promise<AppConfig>, runtimeOptions?: RuntimeOptions) => HttpsFunction;
