import { ExpressRequest } from '../interfaces';
import { Model } from '../model';
export declare const models: (options: {
    [key: string]: typeof Model;
}) => (request: ExpressRequest, response: import("express").Response, next: () => void) => void;
