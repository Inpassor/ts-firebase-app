import {ComponentAction} from './component-action';
import {ComponentOptions} from './component-options';

export interface IComponent extends ComponentOptions {
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
    sendError: (error: any) => void;

    /* static */
    getCodeFromError: (error: any) => number;
    getMessageFromError: (error: any) => any;

    [key: string]: any;
}
