import { ModelFieldSchema } from './model-field-schema';
import { ModelFieldType } from './model-field-type';
export interface ModelSchema {
    [key: string]: ModelFieldSchema | ModelFieldType;
}
