import { BodyParserBasicOptions } from './body-parser-basic-options';
export interface BodyParserJsonOptions extends BodyParserBasicOptions {
    reviver?: (key: string, value: any) => any;
    strict?: boolean;
}
