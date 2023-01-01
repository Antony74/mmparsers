import {
    RegexComponent,
    regexComponent,
    RegexStringCallback,
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

    const regexStringCallback: RegexStringCallback = (
        baseComponent: RegexComponent
    ): string => {
        const name = state.groupName ? `?<${state.groupName}>` : '';
        return `(${name}${regexComponents
            .map((r) => r.toRegexString())
            .join('|')})${baseComponent.getRegexQuantifier()}`;
    };

    const component = {
        ...regexComponent({ regexStringCallback }),
        withGroupName: (groupName: string) => {
            return orWithState({ groupName }, ...components);
        },
    };

    return component;
};
