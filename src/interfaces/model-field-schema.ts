import {ModelFieldType} from './model-field-type';

export interface ModelFieldSchema {
    type: ModelFieldType;
    key?: string;
    set?: (value: any) => boolean; // eslint-disable-line @typescript-eslint/no-explicit-any
    get?: () => any; // eslint-disable-line @typescript-eslint/no-explicit-any
    validate?: (value: any) => boolean; // eslint-disable-line @typescript-eslint/no-explicit-any
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isModelFieldSchema = (modelFieldSchema: any): modelFieldSchema is ModelFieldSchema => {
    return modelFieldSchema.hasOwnProperty('type');
};
