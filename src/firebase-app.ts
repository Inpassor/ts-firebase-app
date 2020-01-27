import {
    RuntimeOptions,
    HttpsFunction,
    runWith,
} from 'firebase-functions';

import {expressApp} from './express-app';
import {AppConfig} from './interfaces';

export const firebaseApp = (getConfig: AppConfig | Promise<AppConfig>, runtimeOptions?: RuntimeOptions): HttpsFunction => {
    return runWith(runtimeOptions).https.onRequest(async (request, response) => {
        await new Promise((resolve, reject) => {
            Promise.resolve(getConfig).then(
                (config: AppConfig): void => {
                    const app = expressApp(config);
                    resolve(app(request, response));
                },
                error => reject(error),
            );
        });
    });
};
