/// <reference types="node" />
import * as express from 'express';
import { Model } from '../model';
import { AuthType } from './auth-type';
import { Express } from './express';
import { ValidateHeadersFunction } from './validate-headers-function';
export interface ExpressRequest extends express.Request {
    app: Express;
    session?: {
        id: string;
        cookie: {
            expires?: false | Date;
            maxAge?: number;
            originalMaxAge?: number;
        };
        regenerate: (error: any) => void;
        destroy: (error: any) => void;
        reload: (error: any) => void;
        save: (error: any) => void;
        touch: () => void;
        [key: string]: any;
    };
    sessionID?: string;
    authType?: AuthType | number;
    validateHeaders?: false | ValidateHeadersFunction;
    rawBody?: Buffer;
    sanitize?: (value: any) => any;
    models?: {
        [key: string]: typeof Model;
    };
}
