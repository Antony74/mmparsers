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

    const toRegexString = (baseComponent: RegexComponent): string => {
        const startsWith = state.beginning ? '^' : '';
        const endsWith = state.end ? '$' : '';

        const finalRegex = regexComponents
            .map((r) => {
                return r.toRegexString(r);
            })
            .join('');

        if (!baseComponent.getRegexQuantifier())
            return `${startsWith}${finalRegex}${endsWith}`;
            
        return `${startsWith}(${finalRegex})${baseComponent.getRegexQuantifier()}${endsWith}`;
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
