/**
 * @see https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html
 */
/// <reference types="node" />
import { IncomingHttpHeaders } from 'http';
import { AWS4AuthHeader } from './aws4-auth-header';
export declare class AWS4 {
    static algorithm: string;
    static actionName: string;
    static parseAuthorizationHeader(authorizationHeader: string): AWS4AuthHeader;
    static createAuthorizationHeader(accessKeyId: string, regionName: string, serviceName: string, signedHeaders: string, body: string): string;
    static dateToDateStamp(date: Date): string;
    static dateToAmzDate(date: Date): string;
    static getAmzDate(arg?: IncomingHttpHeaders | Date): string;
    static validateAuthorizationHeader(authorizationHeader: string, xAmzDate: string, body: string, accessKeyId: string, regionName: string): boolean;
    static getSignature(stringToSign: string, signatureKey: string): string;
    static getBodyHash(body: string): string;
    static getStringToSign(xAmzDate: string, body: string, accessKeyId: string, dateStamp: string, regionName: string, serviceName: string): string;
    static getSignatureKey(key: string, dateStamp: string, regionName: string, serviceName: string): string;
}
