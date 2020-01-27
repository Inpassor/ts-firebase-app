import { ExpressRequest, Route, ValidateHeadersFunction } from '../interfaces';
export declare const routes: (options: {
    routes: Route[];
    authType?: number;
    validateHeaders?: false | ValidateHeadersFunction;
}) => (request: ExpressRequest, response: import("express").Response, next: () => void) => void;
