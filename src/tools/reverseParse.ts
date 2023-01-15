import { isParentNode, TreeNode, TreeNodeParent } from '../mmParser/mmParseTree';

export const reverseParse = (node: TreeNode): string => {
    if (isParentNode(node)) {
        return node.children.map(reverseParse).join('');
    } else {
        return node.text;
    }
};
