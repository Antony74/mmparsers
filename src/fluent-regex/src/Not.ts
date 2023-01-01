import { RegexComponent, regexComponent } from './RegexComponent';

export const not = (regex: RegexComponent) => {
    const toRegexString = (baseComponent: RegexComponent): string => {
        return `[^${regex.toRegexString(
            regex
        )}]${baseComponent.getRegexQuantifier()}`;
    };

    const component = { ...regexComponent({ toRegexString }), toRegexString };

    return component;
};
