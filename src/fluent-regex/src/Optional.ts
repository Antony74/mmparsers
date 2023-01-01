import { regexComponent, RegexComponent } from './RegexComponent';
import { regexLiteral } from './RegexLiteral';

export const optional = (regex: RegexComponent | string) => {
    const innerRegex: RegexComponent =
        typeof regex === 'string' ? regexLiteral(regex) : regex;

    const toRegexString = () => {
        return `(${innerRegex.toRegexString(innerRegex)})?`;
    };

    const component = {
        ...regexComponent({ toRegexString }),
        toRegexString,
    };

    return component;
};
