import {
    ExpressRequest,
    ExpressResponse,
} from '../interfaces';

export const rawBodyGetter = () => {
    return (request: ExpressRequest, response: ExpressResponse, next: () => void): void => {
        request.rawBody = '';
        request.on('data', (chunk: any) => {
            request.rawBody += chunk;
        });
        request.on('end', next);
    };
};
