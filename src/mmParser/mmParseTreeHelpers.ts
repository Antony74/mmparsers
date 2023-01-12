type Whitespace = { type: 'WHITESPACE'; text: string };
type Comment = { type: '_COMMENT', text: string };
type MathSymbol = { type: 'MATH_SYMBOL'; text: string };
type Assertion = { type: 'assertion'; children: (MathSymbol | Whitespace)[] };

const minToken = (token: moo.Token): any => {
    const { type, text } = token;

    if (!type) {
        throw new Error('Type missing from token');
    }

    return { type, text };
};

export const assertion = (d: any): Assertion => {
    return {
        type: 'assertion',
        children: d.flat(Number.MAX_SAFE_INTEGER).map(minToken),
    };
};

export const _ = (d: any[]): (Whitespace | Comment)[] =>
    d.filter((item) => item !== null);

export const whitespace = (d: any): Whitespace => minToken(d[0]);

export const comment = (d: any): Comment => minToken(d[0]);
