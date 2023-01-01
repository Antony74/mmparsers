import {
    RegexComponent,
    regexComponent,
    RegexStringCallback,
} from './RegexComponent';

export const not = (regex: RegexComponent) => {
    const regexStringCallback: RegexStringCallback = (
        baseComponent: RegexComponent
    ): string => {
        return `[^${regex.toRegexString()}]${baseComponent.getRegexQuantifier()}`;
    };

    const component = { ...regexComponent({ regexStringCallback }) };

    return component;
};
