import * as RegexLiteral from '../src/RegexLiteral';

describe('RegexLiteral', () => {
    it('specific word', () => {
        const r = RegexLiteral.regexLiteral('gillyb');
        expect(r.toRegexString()).toEqual('gillyb');
    });

    it('with special characters', () => {
        const r = RegexLiteral.regexLiteral('gilly{b} and a slash\\');
        expect(r.toRegexString()).toEqual('gilly\\{b\\} and a slash\\\\');
    });

    it('single digit', () => {
        const r = RegexLiteral.anyDigit();
        expect(r.toRegexString()).toEqual('\\d');
    });
    it('digit with quantifier', () => {
        const r = RegexLiteral.anyDigit().exactAmount(3);
        expect(r.toRegexString()).toEqual('\\d{3}');
    });

    it('single character', () => {
        const r = RegexLiteral.anyLetter();
        expect(r.toRegexString()).toEqual('[a-zA-Z]');
    });
    it('single character with quantifier', () => {
        const r = RegexLiteral.anyLetter().upToAmount(2);
        expect(r.toRegexString()).toEqual('[a-zA-Z]{1,2}');
    });
});
