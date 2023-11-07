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

const checkWriters = (fn: (JsonWriter) => void): void => {
    const actualMsg = getError(
        fn,
        createStringJsonWriter(() => {}),
    );

    let str = '';
    fn(createUnvalidatedStringJsonWriter((s) => (str += s)));
    const expectedMsg = getError(JSON.parse, str);

    expect(actualMsg).toEqual(expectedMsg);
};

describe('validatingJsonWriter', () => {
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Errors/JSON_bad_parse

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

    test('SyntaxError: JSON.parse: end of data while reading object contents', () => {
        checkWriters((writer) => writer.beginObject().finish());
    });

    // SyntaxError: JSON.parse: expected property name or '}'
    // SyntaxError: JSON.parse: end of data when ',' or ']' was expected
    // SyntaxError: JSON.parse: expected ',' or ']' after array element
    // SyntaxError: JSON.parse: end of data when property name was expected
    // SyntaxError: JSON.parse: expected double-quoted property name
    // SyntaxError: JSON.parse: end of data after property name when ':' was expected
    // SyntaxError: JSON.parse: expected ':' after property name in object
    // SyntaxError: JSON.parse: end of data after property value in object
    // SyntaxError: JSON.parse: expected ',' or '}' after property value in object
    // SyntaxError: JSON.parse: expected ',' or '}' after property-value pair in object literal
    // SyntaxError: JSON.parse: property names must be double-quoted strings
    // SyntaxError: JSON.parse: expected property name or '}'
    // SyntaxError: JSON.parse: unexpected character
    // SyntaxError: JSON.parse: unexpected non-whitespace character after JSON data
});
