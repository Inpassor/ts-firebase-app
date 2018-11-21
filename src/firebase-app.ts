import * as functions from 'firebase-functions';

import {expressApp} from './express-app';
import {AppConfig} from './interfaces';

export const firebaseApp = (getConfig: AppConfig | Promise<AppConfig>): functions.HttpsFunction => {
    return functions.https.onRequest(async (request, response) => {
        await new Promise((resolve, reject) => {
            Promise.resolve(getConfig).then((config: AppConfig): void => {
                const app = expressApp(config);
                resolve(app(request, response));
            }, (error: any) => {
                reject(error);
            });
        });
    });
};
