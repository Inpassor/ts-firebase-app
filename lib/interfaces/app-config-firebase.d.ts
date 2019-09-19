export interface AppConfigFirebase {
    timestampsInSnapshots: boolean;
    projectId?: string;
    keyFileName?: string;
    databaseAuthVariableOverride?: Object;
    databaseURL?: string;
    serviceAccountId?: string;
    storageBucket?: string;
}
