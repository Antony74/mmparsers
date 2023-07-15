import moo from 'moo';
import { not, Regex } from 'fluent-regex-fun';
import { unescapedLiteral } from 'fluent-regex-fun/dist/Regex';
import { objectMap } from '../utils/objectMap';

const { literal, sequence } = Regex;

const rules: { [key: string]: { match: RegExp; lineBreaks?: boolean } } = {
    //  '/*' ( [^*] | '*'+ [^*/] )* '*'* '*/'
    Comment: {
        match: sequence(
            literal('/*'),
            not(literal('*')).zeroOrMore(),
            literal('*/')
        ).toRegex(),
    },
    // #x9 | #xA | #xD | #x20
    S: {
        match: unescapedLiteral('[\\x20\\x09\\x0d\\x0a]').toRegex(),
        lineBreaks: true,
    },
};

const stringRules = objectMap(rules, (rule): moo.Rule => {
    return { ...rule, match: rule.match.source };
});

console.log(JSON.stringify(stringRules, null, 4));

export const lexer = moo.compile(rules);
