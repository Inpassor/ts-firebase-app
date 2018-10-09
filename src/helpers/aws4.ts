/**
 * @see https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html
 */

import * as crypto from 'crypto-js';
import {IncomingHttpHeaders} from 'http';

import {AWS4AuthHeader} from '../interfaces';

export class AWS4 {

    public static algorithm = 'AWS4-HMAC-SHA256';
    public static actionName = 'aws4_request';

    public static parseAuthorizationHeader(authorizationHeader: string): AWS4AuthHeader {
        const authHeader: AWS4AuthHeader = {};
        if (authorizationHeader.startsWith(`${AWS4.algorithm} `)) {
            const headerPartsRaw = authorizationHeader.split(`${AWS4.algorithm} `)[1].split(', ');
            for (const headerPartRaw of headerPartsRaw) {
                const headerPart = headerPartRaw.split('=');
                if (headerPart.length !== 2) {
                    continue;
                }
                switch (headerPart[0]) {
                    case 'Credential':
                        authHeader.credentialScopeRaw = headerPart[1];
                        const credentialScope = headerPart[1].split('/');
                        if (credentialScope.length !== 5) {
                            break;
                        }
                        authHeader.credentialScope = {
                            accessKeyId: credentialScope[0],
                            dateStamp: credentialScope[1],
                            region: credentialScope[2],
                            service: credentialScope[3],
                            action: credentialScope[4],
                        };
                        break;
                    case 'SignedHeaders':
                        authHeader.signedHeadersRaw = headerPart[1];
                        authHeader.signedHeaders = headerPart[1].split(';');
                        break;
                    case 'Signature':
                        authHeader.signature = headerPart[1];
                }
            }
        }
        return authHeader;
    }

    public static createAuthorizationHeader(accessKeyId: string,
                                            regionName: string,
                                            serviceName: string,
                                            signedHeaders: string,
                                            body: string): string {
        const date = new Date();
        const dateStamp = AWS4.dateToDateStamp(date);
        const stringToSign = AWS4.getStringToSign(
            AWS4.dateToAmzDate(date),
            body,
            accessKeyId,
            dateStamp,
            regionName,
            serviceName
        );
        const signatureKey = AWS4.getSignatureKey(
            accessKeyId,
            dateStamp,
            regionName,
            serviceName
        );
        return AWS4.algorithm + ' '
            + 'Credential='
            + accessKeyId + '/'
            + dateStamp + '/'
            + regionName + '/'
            + serviceName + '/'
            + AWS4.actionName + ', '
            + 'SignedHeaders='
            + signedHeaders + ', '
            + 'Signature='
            + AWS4.getSignature(stringToSign, signatureKey);
    }

    public static dateToDateStamp(date: Date): string {
        return date.toISOString().slice(0, 10).replace(/-/g, '');
    }

    public static dateToAmzDate(date: Date): string {
        return date.toISOString().slice(0, 19).replace(/-/g, '').replace(/:/g, '') + 'Z';
    }

    public static getAmzDate(arg?: IncomingHttpHeaders | Date): string {
        if (arg instanceof Date) {
            return AWS4.dateToAmzDate(arg);
        } else if (typeof arg === 'object') {
            return <string>(arg['x-amz-date'] || '');
        } else {
            return AWS4.dateToAmzDate(new Date());
        }
    }

    public static validateAuthorizationHeader(authorizationHeader: string,
                                              xAmzDate: string,
                                              body: string,
                                              accessKeyId: string,
                                              regionName: string): boolean {
        const authHeader: AWS4AuthHeader = AWS4.parseAuthorizationHeader(authorizationHeader);
        if (authHeader.credentialScope) {
            const stringToSign = AWS4.getStringToSign(
                xAmzDate,
                body,
                accessKeyId,
                authHeader.credentialScope.dateStamp,
                regionName,
                authHeader.credentialScope.service
            );
            const signatureKey = AWS4.getSignatureKey(
                accessKeyId,
                authHeader.credentialScope.dateStamp,
                regionName,
                authHeader.credentialScope.service
            );
            const signature = AWS4.getSignature(stringToSign, signatureKey);
            return signature === authHeader.signature;
        }
        return false;
    }

    public static getSignature(stringToSign: string, signatureKey: string): string {
        return crypto.HmacSHA256(stringToSign, signatureKey).toString(crypto.enc.Hex);
    }

    public static getBodyHash(body: string): string {
        return crypto.SHA256(body).toString(crypto.enc.Hex).toLowerCase();
    }

    public static getStringToSign(xAmzDate: string,
                                  body: string,
                                  accessKeyId: string,
                                  dateStamp: string,
                                  regionName: string,
                                  serviceName: string): string {
        return AWS4.algorithm + '\n'
            + xAmzDate + '\n'
            + accessKeyId + '/'
            + dateStamp + '/'
            + regionName + '/'
            + serviceName + '/'
            + AWS4.actionName + '\n'
            + AWS4.getBodyHash(body);
    }

    public static getSignatureKey(key: string,
                                  dateStamp: string,
                                  regionName: string,
                                  serviceName: string): string {
        const dateKey = crypto.HmacSHA256(dateStamp, `AWS4${key}`);
        const regionKey = crypto.HmacSHA256(regionName, dateKey);
        const serviceKey = crypto.HmacSHA256(serviceName, regionKey);
        return crypto.HmacSHA256(AWS4.actionName, serviceKey).toString();
    }

}
