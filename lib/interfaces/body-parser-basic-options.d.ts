/// <reference types="node" />
import * as express from 'express';
import { ExpressRequest } from './express-request';
import { ExpressResponse } from './express-response';
export interface BodyParserBasicOptions {
    inflate?: boolean;
    limit?: number | string;
    type?: string | string[] | ((request: express.Request) => boolean);
    verify?: (request: ExpressRequest, response: ExpressResponse, buffer: Buffer, encoding: string) => void;
}
