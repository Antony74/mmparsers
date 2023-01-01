import * as R from '../src/Regex';
import * as RegexLiteral from '../src/RegexLiteral';
import { regexSequence } from '../src/RegexSequence';
import * as Group from '../src/Group';
import { RegexFlags } from '../src/RegexFlags';

/**
 * This file is just to check some actual real life examples
 * to see that they 'compile' into the correct regexes we're
 * trying to construct, so we know this library is actually
 * useful.
 */

describe('Real life examples', () => {
    it('american phone number', () => {
        const r = R.sequence(
            regexSequence(
                '(',
                RegexLiteral.anyDigit().exactAmount(3),
                ')-'
            ).optional(),
            RegexLiteral.anyDigit().exactAmount(3),
            '-',
            RegexLiteral.anyDigit().exactAmount(4)
        );
        expect(r.toRegexString()).toEqual('(\\(\\d{3}\\)-)?\\d{3}-\\d{4}');
    });

    it('simple email validation', () => {
        // This isn't a real valid email check - don't use this!
        const r = R.sequence(
            Group.or(R.digit(), R.letter(), '.', '+', '(', ')').atLeastAmount(
                2
            ),
            '@',
            Group.or(R.digit(), R.letter(), '.', '+', '(', ')').atLeastAmount(
                2
            ),
            '.',
            R.letter().atLeastAmount(2),
            R.sequence('.', R.letter().atLeastAmount(2)).optional()
        );
        expect(r.toRegexString()).toEqual(
            '(\\d|[a-zA-Z]|\\.|\\+|\\(|\\)){2,}@(\\d|[a-zA-Z]|\\.|\\+|\\(|\\)){2,}\\.[a-zA-Z]{2,}(\\.[a-zA-Z]{2,})?'
        );
    });

    it('simple IP address validation', () => {
        const r = R.sequence(
            R.digit().upToAmount(3),
            '.',
            R.digit().upToAmount(3),
            '.',
            R.digit().upToAmount(3),
            '.',
            R.digit().upToAmount(3)
        );
        expect(r.toRegexString()).toEqual(
            '\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}'
        );
    });

    // Some dead simple examples (to make sure the README file is correct!)
    it('really simple use cases', () => {
        // searching for my first name and optional last name, case insensitive
        const r1 = R.sequence('gilly', R.optional(' barr')).toRegex(
            RegexFlags.IGNORE_CASE
        );
        expect(r1.toString()).toEqual('/gilly( barr)?/i');

        // search for 3 digits in parentheses
        const r2 = R.sequence('(', RegexLiteral.anyDigit().exactAmount(3), ')');
        expect(r2.toRegexString()).toEqual('\\(\\d{3}\\)');
    });
});
