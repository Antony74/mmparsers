import { RegexComponent, regexComponent } from './RegexComponent';

export const not = (regex: RegexComponent) => {
    const toRegexString = (): string => {
        return `[^${regex.toRegexString()}]${component.getRegexQuantifier()}`;
    };

    const component = {...regexComponent({toRegexString}), toRegexString};

    return component;
};
