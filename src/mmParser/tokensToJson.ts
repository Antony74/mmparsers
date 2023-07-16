import { JsonWriter } from '../jsonWriter/jsonWriter';
import { TokenStream } from './tokenStream';
import { TokenEventObject } from './TokenEventObject';

export const createTokensToJson = (writer: JsonWriter): TokenStream => {
    let ws: string[] = [];
    let startProofBlock = false;

    writer
        .beginObject()
        .name('type')
        .value('database')
        .name('children')
        .beginArray();

    const beginDoubleBlock = (
        outerName: string,
        tokenName: string,
        innerName: string,
    ): void => {
        writer
            .beginObject()
            .name('ws')
            .value(ws)
            .name('type')
            .value(outerName)
            .name('children')
            .beginArray()
            .value({ type: tokenName, text: tokenName })
            .beginObject()
            .name('type')
            .value(innerName)
            .name('children')
            .beginArray();
        ws = [];
    };

    const hook: TokenStream = {
        onToken: (token: TokenEventObject): string => {
            switch (token.type) {
                case 'WHITESPACE':
                case '_COMMENT':
                    ws.push(token.text);
                    break;
                case 'MATH_SYMBOL':
                case 'LABEL':
                    if (startProofBlock) {
                        writer
                            .beginObject()
                            .name('type')
                            .value('uncompressed_proof')
                            .name('children')
                            .beginArray();
                        startProofBlock = false;
                    }
                    writer.value({
                        ws,
                        type: token.type,
                        text: token.text,
                    });
                    ws = [];
                    break;
                case '$.':
                case '$}':
                    writer.close().close();
                    writer.value({ ws, type: token.type, text: token.text });
                    ws = [];
                    writer.close().close();
                    break;
                case '$=':
                    writer.close().close();
                    writer.value({ ws, type: '$p', text: '$p' });
                    startProofBlock = true;
                    break;
                case '$c':
                    beginDoubleBlock('constant_stmt', '$c', 'constants');
                    break;
                case '$v':
                    beginDoubleBlock('variable_stmt', '$v', 'variables');
                    break;
                case '$f':
                    beginDoubleBlock('floating_stmt', '$f', 'statement');
                    break;
                case '$a':
                    beginDoubleBlock('axiom_stmt', '$a', 'assertion');
                    break;
                case '${':
                    beginDoubleBlock('block', '${', 'statements');
                    break;
                case '$e':
                    beginDoubleBlock('essential_stmt', '$e', 'statement');
                    break;
                case '$p':
                    beginDoubleBlock('provable_stmt', '$p', 'assertion');
                    break;
                case 'eof':
                    writer.close().name('trailingWs').value(ws).close();
                    break;
                default:
                    throw new Error(`Unrecognised token ${token.type}`);
            }
            return '';
        },
    };
    return hook;
};
