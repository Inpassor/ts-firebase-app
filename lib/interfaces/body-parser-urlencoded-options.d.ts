import { BodyParserBasicOptions } from './body-parser-basic-options';
export interface BodyParserUrlencodedOptions extends BodyParserBasicOptions {
    extended: boolean;
    parameterLimit?: number;
}
