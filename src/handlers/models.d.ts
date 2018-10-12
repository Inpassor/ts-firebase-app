import { ExpressRequest, ExpressResponse } from '../interfaces';
import { Model } from '../model';
export declare const models: (options: {
    [key: string]: typeof Model;
}) => (request: ExpressRequest, response: ExpressResponse, next: () => void) => void;
