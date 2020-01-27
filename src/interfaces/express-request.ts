import * as express from 'express';
import {Model} from '../model';
import {AuthType} from './auth-type';
import {Express} from './express';
import {ValidateHeadersFunction} from './validate-headers-function';

export interface ExpressRequest extends express.Request {
    app: Express;
    session?: {
        id: string;
        cookie: {
            expires?: false | Date;
            maxAge?: number;
            originalMaxAge?: number;
        };
        regenerate: (error) => void;
        destroy: (error) => void;
        reload: (error) => void;
        save: (error) => void;
        touch: () => void;
        [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
    };
    sessionID?: string;
    authType?: AuthType | number;
    validateHeaders?: false | ValidateHeadersFunction;
    rawBody?: Buffer;
    sanitize?: (value: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
    models?: { [key: string]: typeof Model };
}
