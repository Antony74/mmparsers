import { JsonWriter } from '../jsonWriter/jsonWriter';
import { TokenEventObject, TokenStateStream } from './validatingFsm';

export const createTokensToJson = (writer: JsonWriter): TokenStateStream => {
    writer.value({ hello: 'world' });
    const hook: TokenStateStream = {
        onToken: (token: TokenEventObject) => {
            return [];
        },
    };
    return hook;
};
