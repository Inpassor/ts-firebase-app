import * as express from 'express';
import {ExpressRequest} from './express-request';
import {ExpressResponse} from './express-response';

export interface BodyParserBasicOptions {
    inflate?: boolean; // Defaults to true
    limit?: number | string; // Defaults to '100kb'
    type?: string | string[] | ((request: express.Request) => boolean); // Defaults to application/json
    verify?: (request: ExpressRequest, response: ExpressResponse, buffer: Buffer, encoding: string) => void; // Defaults to undefined
}
