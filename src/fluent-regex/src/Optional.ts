import { RegexComponent } from './RegexComponent';
import { regexLiteral } from './RegexLiteral';

export const optional = (regex: RegexComponent | string) => {
    const innerRegex: RegexComponent =
        typeof regex === 'string' ? regexLiteral(regex) : regex;

    const component = {
        toRegexString: () => {
            return `(${innerRegex.toRegexString()})?`;
        },
    };
};
