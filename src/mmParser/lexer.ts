import moo from 'moo';
import { not, regexLiteral, regexSequence } from '../fluent-regex/src';
import { anyWhitespace } from '../fluent-regex/src/RegexLiteral';

/* ASCII non-whitespace printable characters */
const _PRINTABLE_CHARACTER = regexLiteral(`[\x21-\x7e]`, {
    escapeSpecialCharacters: false,
});

// const PRINTABLE_SEQUENCE = _PRINTABLE_CHARACTER.onceOrMore();

// console.log({_PRINTABLE_CHARACTER, PRINTABLE_SEQUENCE});

// MATH-SYMBOL ::= (_PRINTABLE-CHARACTER - '$')+

// LABEL ::= ( _LETTER-OR-DIGIT | '.' | '-' | '_' )+

// _LETTER-OR-DIGIT ::= [A-Za-z0-9]

// COMPRESSED-PROOF-BLOCK ::= ([A-Z] | '?')+

// /* Define whitespace between tokens. The -> SKIP
//    means that when whitespace is seen, it is
//    skipped and we simply read again. */
// WHITESPACE ::= (_WHITECHAR+ | _COMMENT) -> SKIP

// /* Comments. $( ... $) and do not nest. */
// _COMMENT ::= '$(' (_WHITECHAR+ (PRINTABLE-SEQUENCE - '$)')*
//   _WHITECHAR+ '$)' _WHITECHAR

// /* Whitespace: (' ' | '\t' | '\r' | '\n' | '\f') */
// _WHITECHAR ::= [#x20#x09#x0d#x0a#x0c]

const openComment = regexLiteral('$(');
const closeComment = regexLiteral('$)');

export const mooLexerRules: moo.Rules = {
    ws: {
        match: anyWhitespace().onceOrMore().toRegex(),
        lineBreaks: true,
    },
    comment: {
        match: regexSequence(
            openComment,
            not(closeComment).zeroOrMore(),
            closeComment
        ).toRegex(),
        lineBreaks: true,
    },
};

export const lexer = moo.compile(mooLexerRules);
