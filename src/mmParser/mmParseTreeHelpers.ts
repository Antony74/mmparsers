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
                children: d
                    .slice(2, -1)
                    .flat(Number.MAX_SAFE_INTEGER)
                    .map(minToken),
            },
            minToken(d[d.length - 1]),
        ],
    };
};

export const block = (d: any) => {
    return {
        type: 'block',
        children: [
            minToken(d[0]),
            d[1],
            {
                type: 'statements',
                children: d[2].flat(3),
            },
            minToken(d[3]),
        ],
    };
};

export const variable_stmt = (d: any) => {
    d = d.flat(Number.MAX_SAFE_INTEGER);
    return {
        type: 'variable_stmt',
        children: [
            minToken(d[0]),
            d[1],
            {
                type: 'variables',
                children: d.slice(2, -1).map(minToken),
            },
            minToken(d[d.length - 1]),
        ],
    };
};

export const hypothesis_stmt = (d: any) => {
    d = d.flat(Number.MAX_SAFE_INTEGER);
    return {
        type: 'essential_stmt',
        children: [
            minToken(d[0]),
            minToken(d[1]),
            minToken(d[2]),
            minToken(d[3]),
            {
                type: 'statement',
                children: d.slice(4, -1).map(minToken),
            },
            minToken(d[d.length - 1]),
        ],
    };
};

export const floating_stmt = (d: any) => {
    d = d.flat(Number.MAX_SAFE_INTEGER);
    return {
        type: 'floating_stmt',
        children: [
            minToken(d[0]),
            minToken(d[1]),
            minToken(d[2]),
            minToken(d[3]),
            {
                type: 'statement',
                children: d.slice(4, -1).map(minToken),
            },
            minToken(d[d.length - 1]),
        ],
    };
};

//export const hypothesis_stmt = (d) => d.flat();
export const assert_stmt = (d: any) => d.flat();

export const axiom_stmt = (d: any) => {
    d = d.flat(1);
    return {
        type: 'axiom_stmt',
        children: [
            minToken(d[0]), // LABEL
            d[1], // _
            minToken(d[2]), // $a
            d[3], // _
            minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]), // typecode
            d[5], // _
            d[6], // assertion
            minToken(d[7]), // $.
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
