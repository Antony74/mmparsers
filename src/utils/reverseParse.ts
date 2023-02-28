import { TreeNode, isParentNode } from './genericParseTree';

export const reverseParse = (node: TreeNode): string => {
    const ws = (node.ws ?? []).join('');
    const trailingWs = (node.trailingWs ?? []).join('');

    if (isParentNode(node)) {
        return ws + node.children.map(reverseParse).join('') + trailingWs;
    } else {
        return ws + node.text + trailingWs;
    }
};
