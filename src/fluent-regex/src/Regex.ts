import { RegexComponent } from './RegexComponent';

import {
    anyDigit,
    anyLetter,
    regexLiteral,
    RegexLiteralConfiguration,
} from './RegexLiteral';

import { regexSequence } from './RegexSequence';
import { group as importedGroup, nonCapturing } from './Group';
import { optional as importedOptional } from './Optional';
import { or as importedOr } from './Or';

/**
 * These are some comfortable shorthands for nicer coding :)
 */

export const literal = (regexString: string) => {
    return regexLiteral(regexString, { escapeSpecialCharacters: true });
};

export const unescapedLiteral = (regexString: string) => {
    return regexLiteral(regexString, { escapeSpecialCharacters: false });
};

export const sequence = (...components: (string | RegexComponent)[]) => {
    return regexSequence(...components);
};

export const group = (regex: RegexComponent, groupName?: string) => {
    return importedGroup(regex, groupName);
};

export const nonCapturingGroup = (regex: RegexComponent) => {
    return nonCapturing(regex);
};

export const optional = (regex: RegexComponent | string) => {
    return importedOptional(regex);
};

export const or = (...components: (RegexComponent | string)[]) => {
    return importedOr(...components);
};

// More specific stuff (might be controversial)
export const digit = () => {
    return anyDigit();
};
export const letter = () => {
    return anyLetter();
};
