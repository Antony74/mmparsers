import { JsonWriter } from '../jsonWriter/jsonWriter';
import { TokenEventObject, TokenStream } from './validatingFsm';

export const createTokensToJson = (jsonWriter: JsonWriter): TokenStream => {
    const hook: TokenStream = {onToken: (token: TokenEventObject) => {return []}};
    return hook;
};
