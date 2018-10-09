import { ExpressRequest, ExpressResponse, AppConfigFirebase } from '../interfaces';
export declare const firebase: (options: AppConfigFirebase) => (request: ExpressRequest, response: ExpressResponse, next: () => void) => void;
