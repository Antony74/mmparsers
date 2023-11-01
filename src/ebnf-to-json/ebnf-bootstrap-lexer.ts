import moo from 'moo';
import { not, Regex } from 'fluent-regex-fun';
import { objectMap } from '../utils/objectMap';

const { literal, nonCapturingGroup, sequence, unescapedLiteral } = Regex;

const rules: { [key: string]: { match: RegExp; lineBreaks?: boolean } } = {
    // Name - (Char* ':' Char*)
    NCName: {
        match: nonCapturingGroup(unescapedLiteral('[\\x21-\\xD7FF]'))
            .exclude(unescapedLiteral(`[\\/\\*\\:\\=\\'\\"\\[\\]]`))
            .onceOrMore()
            .toRegex(),
    },
    // '/*' ( [^*] | '*'+ [^*/] )* '*'* '*/'
    Comment: {
        match: sequence(
            literal('/*'),
            not(literal('*')).zeroOrMore(),
            literal('*/'),
        ).toRegex(),
    },
    // #x9 | #xA | #xD | #x20
    S: {
        match: unescapedLiteral('[\\x20\\x09\\x0d\\x0a]')
            .onceOrMore()
            .toRegex(),
        lineBreaks: true,
    },
    '::=': { match: literal('::=').toRegex() },
    '**': { match: literal('*').toRegex() },
    '?': { match: literal('?').toRegex() },
    '+': { match: literal('+').toRegex() },
    '(': { match: literal('(').toRegex() },
    ')': { match: literal(')').toRegex() },
    CharClass: {
        match: unescapedLiteral(`\\[[^\\]]*\\]`).toRegex(),
    },
    StringLiteral: { match: unescapedLiteral(`'[^']*'|"[^"]*"`).toRegex() },
};

export const stringRules = objectMap(rules, (rule): moo.Rule => {
    return { ...rule, match: rule.match.source };
});

//console.log(JSON.stringify(stringRules, null, 4));

export const ebnfLexer = moo.compile(rules);
