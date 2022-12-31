import moo from 'moo';
import { Not, RegexLiteral, RegexSequence } from '../fluent-regex/src';

const openComment = new RegexLiteral('$(');
const closeComment = new RegexLiteral('$)');

const rules: moo.Rules = {
    wh: {
        match: RegexLiteral.anyWhitespace().onceOrMore().toRegex(),
        lineBreaks: true,
    },
    comment: {
        match: new RegexSequence(
            openComment,
            new Not(closeComment).zeroOrMore(),
            closeComment
        ).toRegex(),
        lineBreaks: true,
    },
};

export const lexer = moo.compile(rules);
