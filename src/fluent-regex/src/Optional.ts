import { regexComponent, RegexComponent } from './RegexComponent';
import { regexLiteral } from './RegexLiteral';

export const optional = (regex: RegexComponent | string) => {
    const innerRegex: RegexComponent =
        typeof regex === 'string' ? regexLiteral(regex) : regex;

    const regexStringCallback = () => {
        return `(${innerRegex.toRegexString()})?`;
    };

    const component = {
        ...regexComponent({ regexStringCallback }),
    };

    return component;
};
