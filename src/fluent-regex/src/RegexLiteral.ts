import { regexComponent, RegexComponentProps } from './RegexComponent';

export interface RegexLiteralConfiguration {
    escapeSpecialCharacters?: boolean;
}

const defaultConfig = {
    escapeSpecialCharacters: true,
};

export const regexLiteral = (
    regexString: string,
    { escapeSpecialCharacters }: RegexLiteralConfiguration = defaultConfig
) => {
    const regexEscapeCharacters = /\.|\^|\$|\*|\+|\?|\(|\)|\[|\{|\}|\\|\|/g;

    if (escapeSpecialCharacters)
        regexString = regexString.replace(regexEscapeCharacters, '\\$&');

    const toRegexString = (): string => {
        const q = component.getRegexQuantifier();
        if (!component.needsWrapping(regexString)) return `${regexString}${q}`;

        return `(${regexString})${q}`;
    };

    const component = {
        ...regexComponent({ toRegexString }),
        toRegexString,
    };

    return component;
};

export const anyDigit = () => {
    return regexLiteral(`\d`, { escapeSpecialCharacters: false });
};

export const anyNonDigit = () => {
    return regexLiteral(`\D`, { escapeSpecialCharacters: false });
};

export const anyLetter = () => {
    return regexLiteral(`[a-zA-Z]`, { escapeSpecialCharacters: false });
};

export const anyWhitespace = () => {
    return regexLiteral(`\s`, { escapeSpecialCharacters: false });
};

export const anyNonWhitespace = () => {
    return regexLiteral(`\S`, { escapeSpecialCharacters: false });
};

export const anyWordCharacter = () => {
    return regexLiteral(`\w`, { escapeSpecialCharacters: false });
};

export const anyNonWordCharacter = () => {
    return regexLiteral(`\W`, { escapeSpecialCharacters: false });
};

export const anyCharacterExceptNewline = () => {
    return regexLiteral(`.`, { escapeSpecialCharacters: false });
};
