export interface AppConfigFirebase {
    timestampsInSnapshots: boolean;
    projectId?: string;
    keyFileName?: string;
    databaseAuthVariableOverride?: Record<string, any>;
    databaseURL?: string;
    serviceAccountId?: string;
    storageBucket?: string;
}
