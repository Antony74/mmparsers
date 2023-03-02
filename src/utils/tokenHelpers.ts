/* eslint-disable @typescript-eslint/no-explicit-any */
import { isParentNode, TreeNode, TreeNodeLeaf } from "./genericParseTree";

export const minToken = <T extends TreeNode>(token: T): T | TreeNodeLeaf => {
    if (!token.type) {
        throw new Error('Type missing from token');
    }

    if (isParentNode(token)) {
        return token;
    }

    if ((token as any).uuid) {
        return token;
    }

    const { type, text } = token;
    return { type, text };
};

export type WSAndTokens = { ws?: string[]; tokens: TreeNode[] };

export const emptyWsAndTokens: WSAndTokens = { tokens: [] };

export const commentsToTokensReducer = (acc: any, value: any): WSAndTokens => {
    if (value.type) {
        const token = minToken(value);
        const type = token.type;
        return {
            ws: [],
            tokens: [...acc.tokens, { type, ws: acc.ws, ...token }],
        };
    } else {
        return {
            ws: acc.ws ? [...acc.ws, value] : [value],
            tokens: acc.tokens,
        };
    }
};

export const combineWsAndToken = <T extends TreeNode>(
    ws: string | string[],
    token: T
): T => {
    if (Array.isArray(ws)) {
        return { ws, ...token };
    } else {
        return { ws: [ws], ...token };
    }
};
