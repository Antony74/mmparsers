import { RegexComponent, regexComponent } from './RegexComponent';
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

    const toRegexString = (): string => {
        const startsWith = state.beginning ? '^' : '';
        const endsWith = state.end ? '$' : '';
        const finalRegex = regexComponents
            .map((r) => r.toRegexString(component))
            .join('');
        return `${startsWith}(${finalRegex})${component.getRegexQuantifier}${endsWith}`;
    };

    const component = {
        ...regexComponent({ toRegexString }),
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
        toRegexString,
    };

    return component;
};
