export interface AppConfigCache {
    stdTTL?: number; // Defaults to 0
    checkperiod?: number; // Defaults to 600
    errorOnMissing?: boolean; // Defaults to false
    useClones?: boolean; // Defaults to true
    deleteOnExpire?: boolean; // Defaults to true
}
