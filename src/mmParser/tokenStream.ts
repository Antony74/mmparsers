import { TokenEventObject } from './TokenEventObject';

export interface TokenStream {
    onToken(token: TokenEventObject): string[];
}
