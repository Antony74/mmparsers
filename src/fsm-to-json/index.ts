/* eslint-disable @typescript-eslint/no-empty-function */
import { JsonWriter } from '../jsonWriter/jsonWriter';

import {
    createValidatingFSM,
    MachineConfig,
} from './validatingFsm';

import { createFsmToJson } from './fsm-to-json';

export type Parser = {
    feed: (chunk: string) => void;
    finish(): void;
};

// Eventually the tokens will be recorded as whitespace/comments rather than ignored,
// and which tokens they are can be determined automatically as they are orphaned by the ebnf,
// but for now:
const ignoreTokens: Record<string, boolean> = { S: true, Comment: true };

export const createParser = (
    lexer: moo.Lexer,
    machineConfig: MachineConfig,
    writer: JsonWriter,
): Parser => {
    const tokenStream = createFsmToJson(
        createValidatingFSM(machineConfig),
        writer,
        'Validating',
    );

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

                if (!ignoreTokens[type]) {
                    tokenStream.onToken({ ...token, type });
                }
            }
        },
        finish: (): void => {},
    };

    return hook;
};
