import { Component } from '../component';
import { AuthType } from './auth-type';
import { PathParams } from './path-params';
import { ValidateHeadersFunction } from './validate-headers-function';
export interface Route {
    path: PathParams;
    component: typeof Component;
    authType?: AuthType | number;
    validateHeaders?: false | ValidateHeadersFunction;
}
