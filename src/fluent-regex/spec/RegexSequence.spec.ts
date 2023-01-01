import * as RegexLiteral from '../src/RegexLiteral';
import { regexSequence } from '../src/RegexSequence';
import * as Group from '../src/Group';
import { or } from '../src/Or';

describe('RegexSequence', () => {
    it('simple sequence', () => {
        const r = regexSequence(
            RegexLiteral.regexLiteral('gilly'),
            RegexLiteral.regexLiteral('b'),
            RegexLiteral.regexLiteral('@gmail'),
            RegexLiteral.regexLiteral('.com')
        );
        expect(r.toRegexString()).toEqual('gillyb@gmail\\.com');
    });

    it('simple sequence with quantifier', () => {
        const r = regexSequence(
            RegexLiteral.regexLiteral('gillyb'),
            RegexLiteral.anyDigit().optional()
        ).atLeastAmount(3);
        expect(r.toRegexString()).toEqual('(gillyb\\d?){3,}');
    });

    it('complex sequence', () => {
        const r = regexSequence(
            Group.group(
                or(
                    RegexLiteral.anyDigit().exactAmount(3),
                    RegexLiteral.anyDigit().exactAmount(6)
                ),
                'group1'
            ),
            RegexLiteral.anyLetter().upToAmount(6),
            Group.nonCapturing(RegexLiteral.regexLiteral('gillyb').optional())
        );
        expect(r.toRegexString()).toEqual(
            '(?<group1>(\\d{3}|\\d{6}))[a-zA-Z]{1,6}(?:(gillyb)?)'
        );
    });

    it('starts with', () => {
        const r = regexSequence('gilly').startsWith();
        expect(r.toRegexString()).toEqual('^gilly');
    });
    it('ends with', () => {
        const r = regexSequence('gilly').startsWith().endsWith();
        expect(r.toRegexString()).toEqual('^gilly$');
        const r2 = r.atLeastAmount(3);
        expect(r2.toRegexString()).toEqual('^(gilly){3,}$');
    });
});
