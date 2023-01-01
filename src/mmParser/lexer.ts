//
//                               PUBLIC DOMAIN
//
// This file has been released into the Public Domain per the
// Creative Commons CC0 1.0 Universal (CC0 1.0) Public Domain Dedication
// https://creativecommons.org/publicdomain/zero/1.0/
//
// This lexical specification has been ported from the EBNF in the Metamath Book
// https://github.com/metamath/metamath-book/blob/7f710a34054eb563dc3b34d5a03d723bb2a8e767/metamath.tex#L15572
//

import moo from 'moo';
import { literal, sequence } from '../fluent-regex/src/Regex';
import { not } from '../fluent-regex/src';

/* ASCII non-whitespace printable characters */
const _PRINTABLE_CHARACTER = literal('[\x21-\x7e]', {
    escapeSpecialCharacters: false,
});

const PRINTABLE_SEQUENCE = _PRINTABLE_CHARACTER.onceOrMore();

// LABEL ::= ( _LETTER-OR-DIGIT | '.' | '-' | '_' )+

// _LETTER-OR-DIGIT ::= [A-Za-z0-9]

// COMPRESSED-PROOF-BLOCK ::= ([A-Z] | '?')+

/* Whitespace: (' ' | '\t' | '\r' | '\n' | '\f') */
const _WHITECHAR = literal('[\\x20\\x09\\x0d\\x0a\\x0c]', {
    escapeSpecialCharacters: false,
});

export const mooLexerRules: moo.Rules = {
    $c: '$c',
    /* Define whitespace between tokens. */
    WHITESPACE: {
        match: _WHITECHAR.onceOrMore().toRegex(),
        lineBreaks: true,
    },
    /* Comments. $( ... $) and do not nest. */
    //'$(' (_WHITECHAR+ (PRINTABLE-SEQUENCE - '$)')* _WHITECHAR+ '$)' _WHITECHAR
    _COMMENT: {
        match: sequence(
            literal('$('),
            /*PRINTABLE_SEQUENCE.*/ not(literal('$)')).zeroOrMore(),
            _WHITECHAR.onceOrMore(),
            literal('$)'),
            _WHITECHAR
        ).toRegex(),
        lineBreaks: true,
    },
    //    MATH_SYMBOL: `[${_PRINTABLE_CHARACTER.toRegexString()}^\\$]+`,
};

console.log(mooLexerRules);

export const lexer = moo.compile(mooLexerRules);
