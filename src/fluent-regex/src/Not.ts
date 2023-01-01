import { RegexComponent, regexComponent } from './RegexComponent';

export const not = (regex: RegexComponent) => {
    const toRegexString = (baseComponent: RegexComponent): string => {
        return `[^${regex.toRegexString(
            baseComponent
        )}]${component.getRegexQuantifier()}`;
    };

    const component = { ...regexComponent({ toRegexString }), toRegexString };

    return component;
};
