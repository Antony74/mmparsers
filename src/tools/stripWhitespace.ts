/* eslint-disable @typescript-eslint/no-explicit-any */
import { isParentNode, MMNode, TreeNode } from '../mmParser/mmParseTree';

export const isWhitespace = (node: MMNode): boolean => {
    switch (node.type) {
        case '_':
        case 'WHITESPACE':
        case '_COMMENT':
            return true;
        default:
            return false;
    }
};

export const notWhitespace = (node: MMNode): boolean => !isWhitespace(node);

export const stripWhitespace = (node: MMNode): TreeNode => {
    if (isWhitespace(node)) {
        throw new Error(`Can't strip whitespace from whitespace`);
    }

    if (isParentNode(node)) {
        return {
            type: node.type,
            children: (node.children as any)
                .filter(notWhitespace)
                .map(stripWhitespace),
        };
    } else {
        return node;
    }
};
