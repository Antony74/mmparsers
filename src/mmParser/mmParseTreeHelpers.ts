/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    AssertionNode,
    AxiomStmtNode,
    BlockNode,
    ConstantStmtNode,
    Database,
    EssentialStmtNode,
    FloatingStmtNode,
    isParentNode,
    ProvableStmtNode,
    TreeNode,
    TreeNodeLeaf,
    VariableStmtNode,
} from './mmParseTree';

export const minToken = <T extends TreeNode>(token: T): T | TreeNodeLeaf => {
    if (!token.type) {
        throw new Error('Type missing from token');
    }

    if (isParentNode(token)) {
        return token;
    }

    const { type, text } = token;
    return { type, text };
};

type WSAndTokens = { ws: string[]; tokens: TreeNode[] };

const emptyWsAndTokens = {tokens: []};

export const commentsToTokensReducer = (acc: any, value: any): WSAndTokens => {
    if (value.type) {
        const {type, text} = minToken(value);
        return { ws: [], tokens: [...acc.tokens, { type, ws: acc.ws, text }] };
    } else {
        return { ws: [...acc.ws, ...value], tokens: acc.tokens };
    }
};

export const database = (d: any): Database => {
    return { type: 'database', children: d.flat(3) };
};

export const block = (d: any): BlockNode => {
    return {
        type: 'block',
        children: [
            minToken(d[0]),
            //            d[1],
            {
                type: 'statements',
                children: d[2].flat(3),
            },
            minToken(d[3]),
        ],
    };
};

export const constant_stmt = (d: any): ConstantStmtNode => {
    d = d.flat();
    return {
        type: 'constant_stmt',
        children: [
            minToken(d[0]),
            //            d[1],
            {
                type: 'constants',
                children: d
                    .slice(2, -1)
                    .flat(Number.MAX_SAFE_INTEGER)
                    .reduce(commentsToTokensReducer, emptyWsAndTokens).tokens,
            },
            minToken(d[d.length - 1]),
        ],
    };
};

export const variable_stmt = (d: any): VariableStmtNode => {
    d = d.flat(Number.MAX_SAFE_INTEGER);
    return {
        type: 'variable_stmt',
        children: [
            minToken(d[0]),
            //            d[1],
            {
                type: 'variables',
                children: d.slice(2, -1).reduce(commentsToTokensReducer, emptyWsAndTokens).tokens,
            },
            minToken(d[d.length - 1]),
        ],
    };
};

export const essential_stmt = (d: any): EssentialStmtNode => {
    d = d.flat(Number.MAX_SAFE_INTEGER);
    return {
        type: 'essential_stmt',
        children: [
            minToken(d[0]),
            //            minToken(d[1]),
            minToken(d[2]),
            //            minToken(d[3]),
            {
                type: 'statement',
                children: d.slice(4, -1).reduce(commentsToTokensReducer, emptyWsAndTokens).tokens,
            },
            minToken(d[d.length - 1]),
        ],
    };
};

export const floating_stmt = (d: any): FloatingStmtNode => {
    d = d.flat(Number.MAX_SAFE_INTEGER);
    return {
        type: 'floating_stmt',
        children: [
            minToken(d[0]),
            //            minToken(d[1]),
            minToken(d[2]),
            //            minToken(d[3]),
            {
                type: 'statement',
                children: d.slice(4, -1).reduce(commentsToTokensReducer, emptyWsAndTokens).tokens,
            },
            minToken(d[d.length - 1]),
        ],
    };
};

export const axiom_stmt = (d: any): AxiomStmtNode => {
    d = d.flat(1);
    return {
        type: 'axiom_stmt',
        children: [
            minToken(d[0]), // LABEL
            //            d[1], // _
            minToken(d[2]), // $a
            //            d[3], // _
            minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]), // typecode
            //            d[5], // _
            d[6], // assertion
            minToken(d[7]), // $.
        ],
    };
};

export const provable_stmt = (d: any): ProvableStmtNode => {
    return {
        type: 'provable_stmt',
        children: [
            minToken(d[0]), // label
            //          d[1], // _
            minToken(d[2]), // $p
            //            d[3], // _
            minToken(d[4].flat(Number.MAX_SAFE_INTEGER)[0]), // typecode
            //            d[5], // _
            d[6], // assertion
            minToken(d[7]), // $=
            //            d[8], // _
            {
                type: 'proof',
                children: d[9].flat(Number.MAX_SAFE_INTEGER).reduce(commentsToTokensReducer, emptyWsAndTokens).tokens,
            },
            minToken(d[10]), // $.
        ],
    };
};

export const assertion = (d: any): AssertionNode => {
    return {
        type: 'assertion',
        children: d.flat(Number.MAX_SAFE_INTEGER).reduce(commentsToTokensReducer, emptyWsAndTokens).tokens,
    };
};

export const _ = (d: any[]): string[] => {
    return d.flat(Number.MAX_SAFE_INTEGER).filter((item) => item !== null);
};

export const whitespace = (d: any): [string] => d[0].text;
export const comment = (d: any): [string] => d[0].text;
