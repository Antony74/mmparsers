import 'mocha';
import { expect } from 'chai';

import * as RegexLiteral from '../src/RegexLiteral';
import * as Group from '../src/Group';

describe('Group', () => {
    it('simple named group', () => {
        const r = Group.group(
            RegexLiteral.anyDigit().atLeastAmount(2),
            'group1'
        ).optional();
        expect(r.toRegexString()).to.equal('(?<group1>\\d{2,})?');
    });

    it('non capturing group', () => {
        const r = Group.nonCapturing(RegexLiteral.anyWhitespace().zeroOrMore());
        expect(r.toRegexString()).to.equal('(?:\\s*)');
    });

    it('OR group', () => {
        const r = Group.or(
            RegexLiteral.anyDigit().exactAmount(3),
            RegexLiteral.anyLetter().exactAmount(2)
        );
        expect(r.toRegexString()).to.equal('(\\d{3}|[a-zA-Z]{2})');
    });

    it('OR named group', () => {
        const r = Group.or(
            RegexLiteral.anyDigit().exactAmount(3),
            RegexLiteral.anyLetter().exactAmount(2)
        ).withGroupName('gil');
        expect(r.toRegexString()).to.equal('(?<gil>\\d{3}|[a-zA-Z]{2})');
    });
});
