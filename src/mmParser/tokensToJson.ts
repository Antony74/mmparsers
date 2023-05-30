import { Token } from 'moo';
import { JsonWriter } from '../jsonWriter/jsonWriter';
import { TokenStream } from './tokenStream';

export const createTokensToJson = (writer: JsonWriter): TokenStream => {
    const ws: string[] = [];

    writer
        .beginObject()
        .name('type')
        .value('database')
        .name('children')
        .beginArray();

    const hook = {
        onToken: (token: Token): void => {
            switch (token.type) {
                case 'WHITESPACE':
                case '_COMMENT':
                    ws.push(token.text);
                    break;
                case 'eof':
                    writer.close().name('trailingWs').value(ws).close();
                    break;
                default:
                    throw new Error(`Unrecognised token ${token.type}`);
            }
        },
    };
    return hook;
};
