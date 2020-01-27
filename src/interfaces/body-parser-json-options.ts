import {BodyParserBasicOptions} from './body-parser-basic-options';

export interface BodyParserJsonOptions extends BodyParserBasicOptions {
    reviver?: (key: string, value: any) => any; // eslint-disable-line @typescript-eslint/no-explicit-any
    strict?: boolean; // Defaults to true
}
