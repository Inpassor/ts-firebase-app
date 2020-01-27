export interface AppConfigFirebase {
    timestampsInSnapshots: boolean;
    projectId?: string;
    keyFileName?: string;
    databaseAuthVariableOverride?: Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any
    databaseURL?: string;
    serviceAccountId?: string;
    storageBucket?: string;
}
