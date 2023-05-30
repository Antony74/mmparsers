import { Token } from 'moo';
import { JsonWriter } from '../jsonWriter/jsonWriter';
import { TokenStream } from './tokenStream';

export const createTokensToJson = (writer: JsonWriter): TokenStream => {
    let ws: string[] = [];

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
                case '$c':
                    writer
                        .beginObject()
                        .name('ws')
                        .value(ws)
                        .name('type')
                        .value('constant_stmt')
                        .name('children')
                        .beginArray()
                        .value({ type: '$c', text: '$c' })
                        .beginObject()
                        .name('type')
                        .value('constants')
                        .name('children')
                        .beginArray();
                    ws = [];
                    break;
                case 'MATH_SYMBOL':
                    writer.value({ ws, type: token.type, text: token.text });
                    ws = [];
                    break;
                case '$.':
                    writer.close();
                    writer.close();
                    writer.value({ ws, type: '$.', text: '$.' });
                    ws = [];
                    writer.close();
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
