import { ExpressRequest, ExpressResponse, Route, ValidateHeadersFunction } from '../interfaces';
export declare const routes: (options: {
    routes: Route[];
    authType?: number;
    validateHeaders?: false | ValidateHeadersFunction;
}) => (request: ExpressRequest, response: ExpressResponse, next: () => void) => void;
