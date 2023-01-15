type Whitespace = { type: 'WHITESPACE'; text: string };
type Comment = { type: '_COMMENT'; text: string };
type MathSymbol = { type: 'MATH_SYMBOL'; text: string };
type Label = { type: 'LABEL'; text: string };
type Assertion = { type: 'assertion'; children: (MathSymbol | Whitespace)[] };
type ProvableStmt = { type: 'provable_stmt'; children: any[] }; // no

export const minToken = (token: moo.Token & { children?: any[] }): any => {
    if (Array.isArray(token)) {
        return token;
    } else {
        const { type, text } = token;

        if (!type) {
            throw new Error('Type missing from token');
        }

        if (token.children) {
            return token;
        }

        return { type, text };
    }
};

export const constant_stmt = (d: any) => {
    d = d.flat();
    return {
        type: 'constant_stmt',
        children: [
            minToken(d[0]),
            d[1],
            {
                type: 'constants',
                children: d.slice(2, -1).flat(Number.MAX_SAFE_INTEGER).map(minToken),
            },
            minToken(d[d.length - 1]),
        ],
    };
};

export const provable_stmt = (d: any): ProvableStmt => {
    return {
        type: 'provable_stmt',
        children: [
            minToken(d[0]), // label
            d[1], // _
            minToken(d[2]), // $p
            d[3], // _
            minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]), // typecode
            d[5], // _
            d[6], // assertion
            d[7], // $=
            d[8], // _
            {
                type: 'proof',
                children: d[9].flat(Number.MAX_SAFE_INTEGER).map(minToken),
            },
            minToken(d[10]), // $.
        ],
    };
};

export const assertion = (d: any): Assertion => {
    return {
        type: 'assertion',
        children: d.flat(Number.MAX_SAFE_INTEGER).map(minToken),
    };
};

export const _ = (d: any[]): any /* Underscore */ => {
    return {
        type: '_',
        children: d
            .flat(Number.MAX_SAFE_INTEGER)
            .filter((item) => item !== null),
    };
};

export const whitespace = (d: any): Whitespace => minToken(d[0]);
export const comment = (d: any): Comment => minToken(d[0]);
