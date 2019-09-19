import {BodyParserBasicOptions} from './body-parser-basic-options';

export interface BodyParserTextOptions extends BodyParserBasicOptions {
    defaultCharset?: string; // Defaults to utf-8
}
