import { AppConfigCache } from '../interfaces';
export interface FirebaseConfigOptions {
    projectId: string;
    clientEmail: string;
    privateKey: string;
    host?: string;
    scopes?: string[];
    cacheConfig?: AppConfigCache;
}
export declare class FirebaseConfig {
    host: string;
    scopes: string[];
    cacheConfig: AppConfigCache;
    projectId: string;
    clientEmail: string;
    privateKey: string;
    path: string;
    private _cache;
    private _etag;
    constructor(options: FirebaseConfigOptions);
    getETag(): string;
    setETag(etag: string): void;
    getAccessToken(): Promise<string>;
    getTemplate(version?: number): Promise<string>;
    publishTemplate(template: string): Promise<null>;
}
