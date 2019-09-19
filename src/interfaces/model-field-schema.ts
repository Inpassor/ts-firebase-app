import {ModelFieldType} from './model-field-type';

export interface ModelFieldSchema {
    type: ModelFieldType;
    key?: string;
    set?: (value: any) => boolean;
    get?: () => any;
    validate?: (value: any) => boolean;
}
