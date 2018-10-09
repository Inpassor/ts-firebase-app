import * as functions from 'firebase-functions';

import {expressApp} from './express-app';
import {AppConfig} from './interfaces';

export const firebaseApp = (config: AppConfig) => {
    return functions.https.onRequest(expressApp(config));
};
