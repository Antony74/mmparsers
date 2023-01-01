import {
    regexComponent,
    RegexComponent,
    RegexStringCallback,
} from './RegexComponent';
import { or as importedOr } from './Or';

interface GroupState {
    nonCapturing: boolean;
}

export const group = (regex: RegexComponent, groupName?: string) =>
    groupWithState({ nonCapturing: false }, regex, groupName);

const groupWithState = (
    state: GroupState,
    regex: RegexComponent,
    groupName?: string
) => {
    const groupNameValidator = /^[a-zA-Z][a-zA-Z0-9]*$/; // Yo Dawg, I heard you like regexes in your regex framework, so I put a regex in the regex framework so you can validate the regex your regex framework creates

    if (groupName) {
        if (!groupNameValidator.test(groupName))
            throw `Invalid group name \'${groupName}\'.\nA group name can contain letters and numbers but must start with a letter.`;
    }

    const regexStringCallback: RegexStringCallback = (): string => {
        const regexString = regex.toRegexString();
        const quantifier = component.getRegexQuantifier();

        if (state.nonCapturing) return `(?:${regexString})${quantifier}`;

        if (groupName) return `(?<${groupName}>${regexString})${quantifier}`;

        return `(${regexString})${quantifier}`;
    };

    const component = {
        ...regexComponent({ regexStringCallback }),
    };

    return component;
};

export const nonCapturing = (regex: RegexComponent) => {
    return groupWithState({ nonCapturing: true }, regex);
};

export const or = (...components: (RegexComponent | string)[]) => {
    return importedOr(...components);
};
