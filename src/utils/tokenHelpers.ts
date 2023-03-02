import { isParentNode, TreeNode, TreeNodeLeaf } from './genericParseTree';

type TreeNodeWithUuid = TreeNode & { uuid?: string };

export const minToken = <T extends TreeNodeWithUuid>(
    token: T
): T | TreeNodeLeaf => {
    if (!token.type) {
        throw new Error('Type missing from token');
    }

    if (isParentNode(token)) {
        return token;
    }

    if (token.uuid) {
        return token;
    }

    const { type, text } = token;
    return { type, text };
};

export type WSAndTokens = { ws?: string[]; tokens: TreeNode[] };

export const emptyWsAndTokens: WSAndTokens = { tokens: [] };

export const commentsToTokensReducer = (
    acc: WSAndTokens,
    value: TreeNodeWithUuid | string
): WSAndTokens => {
    if (typeof value === 'string') {
        return {
            ws: acc.ws ? [...acc.ws, value] : [value],
            tokens: acc.tokens,
        };
    } else {
        const token = minToken(value);
        return {
            ws: [],
            tokens: [...acc.tokens, { ws: acc.ws, ...token }],
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
