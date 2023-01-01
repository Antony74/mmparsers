import {
    RegexComponent,
    regexComponent,
    ToRegexStringFn,
} from './RegexComponent';

export const not = (regex: RegexComponent) => {
    const toRegexString: ToRegexStringFn = (
        baseComponent: RegexComponent = component
    ): string => {
        return `[^${regex.toRegexString(
            regex
        )}]${baseComponent.getRegexQuantifier()}`;
    };

    const component = { ...regexComponent({ toRegexString }), toRegexString };

    return component;
};
