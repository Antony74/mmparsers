import 'mocha';
import * as chai from 'chai';

import * as RegexLiteral from '../src/RegexLiteral';
import { or } from '../src/Or';

const expect = chai.expect;
const assert = chai.assert;

describe('Or', () => {
    it('group of regexes', () => {
        const r = or(
            RegexLiteral.anyDigit(),
            RegexLiteral.anyLetter().exactAmount(2),
            RegexLiteral.anyLetter().exactAmount(4)
        );
        expect(r.toRegexString()).to.equal('(\\d|[a-zA-Z]{2}|[a-zA-Z]{4})');
    });
});
