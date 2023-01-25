import { isParentNode, TreeNode } from '../mmParser/mmParseTree';

export const reverseParse = (node: TreeNode): string => {
    const ws = (node.ws ?? []).join('');

    if (isParentNode(node)) {
        return ws + node.children.map(reverseParse).join('');
    } else {
        return ws + node.text;
    }
};
