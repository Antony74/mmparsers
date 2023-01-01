import * as RegexLiteral from '../src/RegexLiteral';
import { optional } from '../src/Optional';

describe('Optional', () => {
    it('digit', () => {
        const r = optional(RegexLiteral.anyDigit());
        expect(r.toRegexString()).toEqual('(\\d)?');
    });

    it('multiple characters', () => {
        const r = optional(RegexLiteral.anyLetter().upToAmount(2));
        expect(r.toRegexString()).toEqual('([a-zA-Z]{1,2})?');
    });
});
