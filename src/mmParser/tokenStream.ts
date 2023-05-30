import { Token } from "moo";

export interface TokenStream {
    onToken(token: Token): void;
}