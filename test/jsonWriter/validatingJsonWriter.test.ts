/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-function */
import { JsonWriter } from '../../src/jsonWriter/jsonWriter';

import {
    createStringJsonWriter,
    createUnvalidatedStringJsonWriter,
} from '../../src/jsonWriter/stringJsonWriter';

const nullWriter: JsonWriter = {
    name: () => nullWriter,
    value: () => nullWriter,
    beginObject: () => nullWriter,
    beginArray: () => nullWriter,
    close: () => nullWriter,
    finish: () => nullWriter,
};

const getError = (fn, ...parameters): string => {
    let message;

    try {
        fn(...parameters);
    } catch (e) {
        message = e.message;
    }
    return message;
};

const checkWriters = (
    fn: (writer: JsonWriter) => void,
    overriddenMessage?: string,
): void => {
    const actualMsg = getError(
        fn,
        createStringJsonWriter(() => {}),
    );

    let str = '';
    fn(createUnvalidatedStringJsonWriter((s) => (str += s)));
    const expectedMsg = getError(JSON.parse, str)
        .split(' at position')[0]
        .split('token t')
        .join('true')
        .split('token f')
        .join('false')
        .split('token n')
        .join('null')
        .split('token u')
        .join('undefined')
        .split('token [')
        .join('array')
        .split('token {')
        .join('object');

    console.log(str, overriddenMessage ?? expectedMsg);
    expect(actualMsg).toEqual(overriddenMessage ?? expectedMsg);
};

describe('validatingJsonWriter', () => {
    // Taken from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/JSON_bad_parse
    // these errors don't match the ones received, but seem very useful and exhaustive.

    // SyntaxError: JSON.parse: unterminated string literal
    // SyntaxError: JSON.parse: bad control character in string literal
    // SyntaxError: JSON.parse: bad character in string literal
    // SyntaxError: JSON.parse: bad Unicode escape
    // SyntaxError: JSON.parse: bad escape character
    // SyntaxError: JSON.parse: unterminated string
    // SyntaxError: JSON.parse: no number after minus sign
    // SyntaxError: JSON.parse: unexpected non-digit
    // SyntaxError: JSON.parse: missing digits after decimal point
    // SyntaxError: JSON.parse: unterminated fractional number
    // SyntaxError: JSON.parse: missing digits after exponent indicator
    // SyntaxError: JSON.parse: missing digits after exponent sign
    // SyntaxError: JSON.parse: exponent part is missing a number
    // SyntaxError: JSON.parse: unexpected end of data
    // SyntaxError: JSON.parse: unexpected keyword
    // SyntaxError: JSON.parse: unexpected character

    test(`SyntaxError: JSON.parse: end of data while reading object contents`, () => {
        checkWriters((writer) => writer.beginObject().finish());
    });

    test(`SyntaxError: JSON.parse: expected property name or '}'`, () => {
        checkWriters((writer) => writer.beginObject().beginArray());
    });

    test(`SyntaxError: JSON.parse: end of data when ',' or ']' was expected`, () => {
        checkWriters((writer) => writer.beginArray().finish());
    });

    test(`SyntaxError: JSON.parse: expected ',' or ']' after array element`, () => {
        checkWriters(
            (writer) => writer.beginArray().value(1).name('fred'),
            'Unexpected name in JSON',
        );
    });

    test(`SyntaxError: JSON.parse: end of data when property name was expected`, () => {
        checkWriters((writer) => writer.beginObject().finish());
    });

    // SyntaxError: JSON.parse: expected double-quoted property name
    // SyntaxError: JSON.parse: end of data after property name when ':' was expected

    test(`SyntaxError: JSON.parse: expected ':' after property name in object`, () => {
        checkWriters((writer) => writer.beginObject().value(1));
        checkWriters((writer) => writer.beginObject().value(true));
        checkWriters((writer) => writer.beginObject().value(false));
        checkWriters((writer) => writer.beginObject().value(null));
        checkWriters((writer) => writer.beginObject().value(undefined as any));
        checkWriters((writer) => writer.beginObject().value([]));
        checkWriters((writer) => writer.beginObject().value({}));
    });

    test(`SyntaxError: JSON.parse: end of data after property value in object`, () => {
        checkWriters((writer) =>
            writer.beginObject().name('a').value(1).finish(),
        );
    });

    // SyntaxError: JSON.parse: expected ',' or '}' after property value in object
    // SyntaxError: JSON.parse: expected ',' or '}' after property-value pair in object literal
    // SyntaxError: JSON.parse: property names must be double-quoted strings
    // SyntaxError: JSON.parse: expected property name or '}'
    // SyntaxError: JSON.parse: unexpected character

    test(`SyntaxError: JSON.parse: unexpected non-whitespace character after JSON data`, () => {
        checkWriters(
            (writer) => writer.beginObject().close().value(1),
            'Unexpected value after JSON data',
        );

        checkWriters(
            (writer) => writer.beginObject().close().beginObject(),
            'Unexpected beginObject after JSON data',
        );

        checkWriters(
            (writer) => writer.beginObject().close().beginArray(),
            'Unexpected beginArray after JSON data',
        );

        checkWriters(
            (writer) => writer.beginObject().close().close(),
            'Unexpected close after JSON data',
        );
    });

    test('Unexpected beginObject in JSON data', () => {
        checkWriters((writer) => writer.beginObject().beginObject());
    });
});
