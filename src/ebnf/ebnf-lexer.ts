import moo from 'moo';
import { Regex } from 'fluent-regex-fun';
import { anyCharacterExceptNewline } from 'fluent-regex-fun/dist/RegexLiteral';

const { literal, nonCapturingGroup, sequence } = Regex;

const rules = {
    //  '/*' ( [^*] | '*'+ [^*/] )* '*'* '*/'
    Comment: sequence(
        literal('/*'),
        nonCapturingGroup(anyCharacterExceptNewline().zeroOrMore()).exclude(
            literal('*')
        ),
        literal('*/')
    ).toRegexString(),
};

console.log(JSON.stringify(rules, null, 4));

export const lexer = moo.compile(rules);
