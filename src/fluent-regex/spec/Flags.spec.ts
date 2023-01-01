import { regexLiteral } from '../src/RegexLiteral';
import { RegexFlags } from '../src/RegexFlags';

describe('Flags', () => {
    it('no flags', () => {
        const r = regexLiteral('gilly');
        expect(r.toRegex().flags).toEqual('');
    });

    it('has some flags', () => {
        const r = regexLiteral('gilly').toRegex(
            RegexFlags.IGNORE_CASE,
            RegexFlags.GLOBAL,
            RegexFlags.UNICODE
        );
        expect(r.ignoreCase).toEqual(true);
        expect(r.global).toEqual(true);
        expect(r.unicode).toEqual(true);
        expect(r.sticky).toEqual(false);
        expect(r.multiline).toEqual(false);
    });
});
