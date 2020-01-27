import {ComponentAction} from './component-action';
import {ComponentOptions} from './component-options';

export interface Component extends ComponentOptions {
    get?: ComponentAction;
    post?: ComponentAction;
    put?: ComponentAction;
    head?: ComponentAction;
    delete?: ComponentAction;
    options?: ComponentAction;
    trace?: ComponentAction;
    copy?: ComponentAction;
    lock?: ComponentAction;
    mkcol?: ComponentAction;
    move?: ComponentAction;
    purge?: ComponentAction;
    propfind?: ComponentAction;
    proppatch?: ComponentAction;
    unlock?: ComponentAction;
    report?: ComponentAction;
    mkactivity?: ComponentAction;
    checkout?: ComponentAction;
    merge?: ComponentAction;
    'm-search'?: ComponentAction;
    notify?: ComponentAction;
    subscribe?: ComponentAction;
    unsubscribe?: ComponentAction;
    patch?: ComponentAction;
    search?: ComponentAction;
    connect?: ComponentAction;
    all?: ComponentAction;
    init: (options: ComponentOptions) => void;
    // transaction: (updateFunction: <T>(transaction: FirestoreTransaction) => Promise<T>) => Promise<any>;
    // batch: () => FirestoreWriteBatch;
    sendError: (error) => void;

    /* static */
    getCodeFromError: (error) => number;
    getMessageFromError: (error) => string;

    [key: string]: any; // eslint-disable-line @typescript-eslint/no-explicit-any
}
