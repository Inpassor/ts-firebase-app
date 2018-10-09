export interface AWS4AuthHeader {
    credentialScopeRaw?: string;
    credentialScope?: {
        accessKeyId: string;
        dateStamp: string;
        region: string;
        service: string;
        action: string;
    };
    signedHeadersRaw?: string;
    signedHeaders?: string[];
    signature?: string;
}
