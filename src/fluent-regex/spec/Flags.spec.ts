import 'mocha';
import * as chai from 'chai';

import { regexLiteral } from '../src/RegexLiteral';
import { RegexFlags } from '../src/RegexFlags';

const expect = chai.expect;
const assert = chai.assert;

describe('Flags', () => {
    it('no flags', () => {
        const r = regexLiteral('gilly');
        expect(r.toRegex().flags).to.equal('');
    });

    it('has some flags', () => {
        const r = regexLiteral('gilly').toRegex(
            RegexFlags.IGNORE_CASE,
            RegexFlags.GLOBAL,
            RegexFlags.UNICODE
        );
        expect(r.ignoreCase).true;
        expect(r.global).true;
        expect(r.unicode).true;
        expect(r.sticky).false;
        expect(r.multiline).false;
    });
});
