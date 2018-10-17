import { Data, AppConfigCache } from '../interfaces';
export interface FirebaseConfigOptions {
    projectId: string;
    keyFileName: string;
    host?: string;
    scopes?: string[];
    cacheConfig?: AppConfigCache;
}
export declare class FirebaseConfig {
    host: string;
    scopes: string[];
    cacheConfig: AppConfigCache;
    projectId: string;
    keyFileName: string;
    path: string;
    private _cache;
    private _etag;
    constructor(options: FirebaseConfigOptions);
    getETag(): string;
    setETag(etag: string): void;
    getAccessToken(): Promise<string>;
    getConfig(version?: number): Promise<Data>;
    publishConfig(config: Data): Promise<null>;
}
