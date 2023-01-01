import * as RegexLiteral from '../src/RegexLiteral';
import { or } from '../src/Or';

describe('Or', () => {
    it('group of regexes', () => {
        const r = or(
            RegexLiteral.anyDigit(),
            RegexLiteral.anyLetter().exactAmount(2),
            RegexLiteral.anyLetter().exactAmount(4)
        );
        expect(r.toRegexString()).toEqual('(\\d|[a-zA-Z]{2}|[a-zA-Z]{4})');
    });
});
