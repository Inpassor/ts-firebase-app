import * as functions from 'firebase-functions';

import {expressApp} from './express-app';
import {AppConfig} from './interfaces';

export const firebaseApp = (getConfig: AppConfig | Promise<AppConfig>): functions.HttpsFunction => {
    return functions.https.onRequest(() => {
        Promise.resolve(getConfig).then((config: AppConfig): void => {
            expressApp(config);
        }, (error: any) => {
            console.error(error);
        });
    });
};
