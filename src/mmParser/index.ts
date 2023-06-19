/* eslint-disable @typescript-eslint/no-empty-function */
import { lexer } from './lexer';
import { JsonWriter } from '../jsonWriter/jsonWriter';
import { createFsmParserValidator } from './fsmParserValidator';

export type MmParser = {
    feed: (chunk: string) => void;
    finish(): void;
};

export const createMmParser = (writer: JsonWriter): MmParser => {
    writer;
    const tokenStream = createFsmParserValidator();

    const hook = {
        feed: (chunk: string): void => {
            lexer.reset(chunk);
            for (;;) {
                const token = lexer.next();

                if (token === undefined) {
                    break;
                }

                const { type } = token;

                if (type === undefined) {
                    throw new Error('Token encountered without type');
                }

                tokenStream.onToken({ ...token, type });
            }
        },
        finish: (): void => {},
    };

    return hook;
};
