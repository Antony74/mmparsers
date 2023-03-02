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
import { Regex } from 'fluent-regex-fun';

const { literal, nonCapturingGroup, sequence, unescapedLiteral } = Regex;

/* ASCII non-whitespace printable characters */
const _PRINTABLE_CHARACTER = nonCapturingGroup(
    unescapedLiteral('[\\x21-\\x7e]')
);

const PRINTABLE_SEQUENCE = _PRINTABLE_CHARACTER.onceOrMore();

/* Whitespace: (' ' | '\t' | '\r' | '\n' | '\f') */
const _WHITECHAR = unescapedLiteral('[\\x20\\x09\\x0d\\x0a\\x0c]');

/* Define whitespace between tokens. */
const WHITESPACE = {
    match: _WHITECHAR.onceOrMore().toRegex(),
    lineBreaks: true,
};

/* Comments. $( ... $) and do not nest. */
const _COMMENT = {
    match: sequence(
        literal('$('),
        nonCapturingGroup(
            sequence(
                _WHITECHAR.onceOrMore(),
                nonCapturingGroup(PRINTABLE_SEQUENCE).exclude(literal('$)'))
            )
        ).zeroOrMore(),
        _WHITECHAR.onceOrMore(),
        literal('$)')
    ).toRegex(),
    lineBreaks: true,
};

const mooLexerRules: moo.Rules = {
    '$.': { match: '$.', next: 'main' },
    '$=': { match: '$=', next: 'proof' },
    $a: { match: '$a', next: 'mathSymbol' },
    $c: { match: '$c', next: 'mathSymbol' },
    $d: { match: '$d', next: 'mathSymbol' },
    $e: { match: '$e', next: 'mathSymbol' },
    $f: { match: '$f', next: 'mathSymbol' },
    $p: { match: '$p', next: 'mathSymbol' },
    $v: { match: '$v', next: 'mathSymbol' },
    '$[': { match: '$[', next: 'mathSymbol' },
    '$]': { match: '$]', next: 'main' },
    '${': '${',
    '$}': '$}',
    '?': '?',
    WHITESPACE,
    _COMMENT,
};

// Note that COMPRESSED_PROOF_BLOCK, LABEL, and MATH_SYMBOL, are not lexically distinct,
// so we have to use lexer states to tell them apart.

const COMPRESSED_PROOF_BLOCK = unescapedLiteral('[A-Z\\?]')
    .onceOrMore()
    .toRegex();

const LABEL = unescapedLiteral('[A-Za-z0-9\\.\\-_]').onceOrMore().toRegex();

const MATH_SYMBOL = _PRINTABLE_CHARACTER
    .exclude(literal('$'))
    .onceOrMore()
    .toRegex();

const states = {
    main: { ...mooLexerRules, LABEL },
    mathSymbol: { ...mooLexerRules, MATH_SYMBOL },
    proof: {
        WHITESPACE,
        _COMMENT,
        LABEL: { match: LABEL, next: 'main' },
        '(': { match: literal('(').toRegex(), next: 'compressedProofLabels' },
    },
    compressedProofLabels: {
        WHITESPACE,
        _COMMENT,
        LABEL,
        ')': { match: literal(')').toRegex(), next: 'compressedProofBlock' },
    },
    compressedProofBlock: { ...mooLexerRules, COMPRESSED_PROOF_BLOCK },
};

export const lexer = moo.states(states);
