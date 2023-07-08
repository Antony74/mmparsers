import moo from 'moo';
import { Regex } from 'fluent-regex-fun';
import { anyCharacterExceptNewline } from 'fluent-regex-fun/dist/RegexLiteral';
import { unescapedLiteral } from 'fluent-regex-fun/dist/Regex';
import { objectMap } from '../utils/objectMap';

const { literal, nonCapturingGroup, sequence } = Regex;

const rules: { [key: string]: RegExp } = {
    Comment: /\/\*/,
    //  '/*' ( [^*] | '*'+ [^*/] )* '*'* '*/'
    // Comment: sequence(
    //     literal('/*'),
    //     nonCapturingGroup(anyCharacterExceptNewline().zeroOrMore()).exclude(
    //         literal('*')
    //     ),
    //     literal('*/')
    // ).toRegexString(),
    // #x9 | #xA | #xD | #x20
    S: unescapedLiteral('[\\x20\\x09\\x0d\\x0a]').toRegex(),
};

const stringRules = objectMap(rules, (rule) => rule.source);

console.log(JSON.stringify(stringRules, null, 4));

export const lexer = moo.compile(rules);