import 'mocha';
import * as chai from 'chai';

import * as RegexLiteral from '../src/RegexLiteral';
import { optional } from '../src/Optional';

const expect = chai.expect;

describe('Optional', () => {
    it('digit', () => {
        const r = optional(RegexLiteral.anyDigit());
        expect(r.toRegexString()).to.equal('(\\d)?');
    });

    it('multiple characters', () => {
        const r = optional(RegexLiteral.anyLetter().upToAmount(2));
        expect(r.toRegexString()).to.equal('([a-zA-Z]{1,2})?');
    });
});
