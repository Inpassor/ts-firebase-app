import { ExpressRequest, ExpressResponse } from '../interfaces';
export declare const sanitize: (request: ExpressRequest, response: ExpressResponse, next: () => void) => void;
