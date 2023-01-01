import {
    RegexComponent,
    regexComponent,
    ToRegexStringFn,
} from './RegexComponent';
import { regexLiteral } from './RegexLiteral';

interface OrState {
    groupName: string;
}

export const or = (...components: (RegexComponent | string)[]) =>
    orWithState({ groupName: '' }, ...components);

const orWithState = (
    state: OrState,
    ...components: (RegexComponent | string)[]
) => {
    const regexComponents = components.map((r) => {
        if (typeof r === 'string') return regexLiteral(r);
        return r;
    });

    const toRegexString: ToRegexStringFn = (
        baseComponent: RegexComponent = component
    ): string => {
        const name = state.groupName ? `?<${state.groupName}>` : '';
        return `(${name}${regexComponents
            .map((r) => r.toRegexString(baseComponent))
            .join('|')})${component.getRegexQuantifier()}`;
    };

    const component = {
        ...regexComponent({ toRegexString }),
        withGroupName: (groupName: string) => {
            return orWithState({ groupName }, ...components);
        },
        toRegexString,
    };

    return component;
};
