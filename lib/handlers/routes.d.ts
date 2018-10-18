import { ExpressRequest, ExpressResponse, Route } from '../interfaces';
export declare const routes: (options: {
    routes: Route[];
    authType?: number;
}) => (request: ExpressRequest, response: ExpressResponse, next: () => void) => void;
