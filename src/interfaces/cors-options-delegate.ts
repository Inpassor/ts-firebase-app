import * as express from 'express';
import {CorsOptions} from './cors-options';

export type CorsOptionsDelegate = (
    req: express.Request,
    callback: (err: Error | null, options?: CorsOptions) => void,
) => void;
