import {
    RegexComponent,
    regexComponent,
    RegexStringCallback,
} from './RegexComponent';
import { regexLiteral } from './RegexLiteral';

interface RegexSequeceState {
    beginning: boolean;
    end: boolean;
}

export const regexSequence = (...components: (RegexComponent | string)[]) =>
    regexSequenceWithState({ beginning: false, end: false }, ...components);

const regexSequenceWithState = (
    state: RegexSequeceState,
    ...components: (RegexComponent | string)[]
) => {
    const regexComponents = components.map((r) => {
        if (typeof r === 'string') return regexLiteral(r);
        return r;
    });

    const regexStringCallback: RegexStringCallback = (
        baseComponent: RegexComponent = component
    ): string => {
        const startsWith = state.beginning ? '^' : '';
        const endsWith = state.end ? '$' : '';

        const finalRegex = regexComponents
            .map((r) => {
                return r.toRegexString();
            })
            .join('');

        if (!baseComponent.getRegexQuantifier())
            return `${startsWith}${finalRegex}${endsWith}`;

        return `${startsWith}(${finalRegex})${baseComponent.getRegexQuantifier()}${endsWith}`;
    };

    const component = {
        ...regexComponent({ regexStringCallback }),
        startsWith: () => {
            return regexSequenceWithState(
                { ...state, beginning: true },
                ...components
            );
        },
        endsWith: () => {
            return regexSequenceWithState(
                { ...state, end: true },
                ...components
            );
        },
    };

    return component;
};
