import { RegexFlags } from './RegexFlags';

export type RegexStringCallback = (baseComponent: RegexComponent) => string;

export interface RegexComponentProps {
    regexStringCallback: RegexStringCallback;
}

export interface RegexComponentState {
    regexQuantifier: string;
    regexStringCallback: RegexStringCallback;
}

export interface RegexComponent {
    getRegexQuantifier(): string;
    optional: () => RegexComponent;
    onceOrMore: () => RegexComponent;
    zeroOrMore: () => RegexComponent;
    exactAmount: (amount: number) => RegexComponent;
    atLeastAmount: (amount: number) => RegexComponent;
    rangeAmount: (min: number, max: number) => RegexComponent;
    upToAmount: (amount: number) => RegexComponent;
    needsWrapping: (regexString: string) => boolean;
    toRegex: (...flags: RegexFlags[]) => RegExp;
    toRegexString: () => string;
}

export const regexComponent = (props: RegexComponentProps): RegexComponent =>
    regexComponentWithState({ ...props, regexQuantifier: '' });

const regexComponentWithState = (state: RegexComponentState) => {
    const assertSingleQuantifier = () => {
        if (state.regexQuantifier)
            throw `Only a single quantifier can be used.\nYou already defined a quantifier for this component (${state.regexQuantifier})`;
    };

    const component = {
        getRegexQuantifier(): string {
            return state.regexQuantifier;
        },
        optional: () => {
            assertSingleQuantifier();
            const regexQuantifier = '?';
            return regexComponentWithState({ ...state, regexQuantifier });
        },
        onceOrMore: () => {
            assertSingleQuantifier();
            const regexQuantifier = '+';
            return regexComponentWithState({ ...state, regexQuantifier });
        },
        zeroOrMore: () => {
            assertSingleQuantifier();
            const regexQuantifier = '*';
            return regexComponentWithState({ ...state, regexQuantifier });
        },
        exactAmount: (amount: number) => {
            assertSingleQuantifier();
            const regexQuantifier = '{' + amount + '}';
            return regexComponentWithState({ ...state, regexQuantifier });
        },
        atLeastAmount: (amount: number) => {
            assertSingleQuantifier();
            const regexQuantifier = `{${amount},}`;
            return regexComponentWithState({ ...state, regexQuantifier });
        },
        rangeAmount: (min: number, max: number) => {
            assertSingleQuantifier();
            const regexQuantifier = `{${min},${max}}`;
            return regexComponentWithState({ ...state, regexQuantifier });
        },
        upToAmount: (amount: number) => {
            return component.rangeAmount(1, amount);
        },
        needsWrapping: (regexString: string) => {
            if (regexString.length === 1) return false;

            // This will catch strings that are wrapped in squared brackets
            // it will catch [xxxx] and fail on this [xxx][xxx]
            // but it will also fail on this: [xxx[x]xxx] // TODO: fix this!
            if (
                regexString.startsWith('[') &&
                regexString.endsWith(']') &&
                regexString.indexOf(']') === regexString.length - 1
            )
                return false;

            // Comment above, applies here as well! // TODO: fix this!
            if (
                regexString.startsWith('(') &&
                regexString.endsWith(')') &&
                regexString.indexOf(')') === regexString.length - 1
            )
                return false;

            if (regexString.startsWith('\\') && regexString.length === 2)
                return false;

            if (!state.regexQuantifier) return false;

            return true;
        },
        toRegex: (...flags: RegexFlags[]) => {
            return new RegExp(state.regexStringCallback(component), flags.join(''));
        },
        toRegexString: () => {
            return state.regexStringCallback(component)
        },
    };

    return component;
};
