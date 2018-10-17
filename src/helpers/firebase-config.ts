import * as https from 'https';
import * as zlib from 'zlib';
import {IncomingMessage} from 'http';
import {google} from 'googleapis';
import * as NodeCache from 'node-cache';

import {AppConfigCache} from '../interfaces';

export interface FirebaseConfigOptions {
    projectId: string;
    clientEmail: string;
    privateKey: string;
    host?: string;
    scopes?: string[];
    cacheConfig?: AppConfigCache;
}

export class FirebaseConfig {

    public host = 'firebaseremoteconfig.googleapis.com';
    public scopes: string[] = [
        'https://www.googleapis.com/auth/firebase.remoteconfig',
    ];
    public cacheConfig: AppConfigCache = null;
    public projectId: string = null;
    public clientEmail: string = null;
    public privateKey: string = null;
    public path: string = null;

    private _cache: NodeCache = null;
    private _etag: string = null;

    constructor(options: FirebaseConfigOptions) {
        Object.assign(this, options);
        this.path = `/v1/projects/${this.projectId}/remoteConfig`;
        this._cache = new NodeCache(this.cacheConfig || {});
    }

    public getETag(): string {
        if (!this._etag) {
            this._etag = this._cache.get('--firebase-config-etag--') || null;
        }
        return this._etag;
    }

    public setETag(etag: string): void {
        if (etag !== this._etag) {
            this._etag = etag;
            this._cache.set('--firebase-config-etag--', this._etag);
        }
    }

    public getAccessToken(): Promise<string> {
        return new Promise((resolve, reject) => {
            const jwtClient = new google.auth.JWT(
                this.clientEmail,
                null,
                this.privateKey,
                this.scopes,
                null
            );
            jwtClient.authorize((error: any, tokens) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(tokens.access_token);
                }
            });
        });
    }

    public getTemplate(version?: number): Promise<string> {
        return new Promise((resolve, reject) => {
            this.getAccessToken().then((accessToken: string) => {
                const buffer = [];
                const request = https.request({
                    hostname: this.host,
                    path: this.path + (version ? `?version_number=${version}` : ''),
                    headers: {
                        'Authorization': `Bearer ${accessToken}`,
                        'Accept-Encoding': 'gzip',
                    },
                }, (response: IncomingMessage) => {
                    if (response.statusCode === 200) {
                        const gunzip = zlib.createGunzip();
                        response.pipe(gunzip);
                        gunzip.on('data', (data: any) => {
                            buffer.push(data.toString());
                        }).on('end', () => {
                            this.setETag(<string>response.headers.etag);
                            resolve(buffer.join(''));
                        }).on('error', (error: any) => reject(error));
                    } else {
                        reject(response['error'] || 'Unable to get template');
                    }
                });
                request.on('error', (error: any) => reject(error));
                request.end();
            }, (error: any) => reject(error));
        });
    }

    public publishTemplate(template: string): Promise<null> {
        return new Promise((resolve, reject) => {
            this.getAccessToken().then((accessToken: string) => {
                const headers = {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json; UTF-8',
                    'Accept-Encoding': 'gzip',
                };
                const etag = this.getETag();
                if (etag) {
                    headers['If-Match'] = etag;
                }
                const request = https.request({
                    hostname: this.host,
                    path: this.path,
                    method: 'PUT',
                    headers,
                }, (response: IncomingMessage) => {
                    if (response.statusCode === 200) {
                        this.setETag(<string>response.headers.etag);
                        resolve();
                    } else {
                        reject(response['error'] || 'Unable to publish template');
                    }
                });
                request.on('error', (error: any) => reject(error));
                request.write(template);
                request.end();
            }, (error: any) => reject(error));
        });
    }

}
