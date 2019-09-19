export interface AppConfigCache {
    stdTTL?: number;
    checkperiod?: number;
    errorOnMissing?: boolean;
    useClones?: boolean;
    deleteOnExpire?: boolean;
}
