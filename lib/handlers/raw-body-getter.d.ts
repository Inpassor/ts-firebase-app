import { ExpressRequest, ExpressResponse } from '../interfaces';
export declare const rawBodyGetter: () => (request: ExpressRequest, response: ExpressResponse, next: () => void) => void;
