export type TreeNodeLeaf = {
    type: string;
    ws?: string[];
    text: string;
    trailingWs?: string[];
};

export type TreeNodeParent = {
    type: string;
    ws?: string[];
    children: (TreeNodeLeaf | TreeNodeParent)[];
    trailingWs?: string[];
};

export type TreeNode = TreeNodeLeaf | TreeNodeParent;

export const isParentNode = (node: TreeNode): node is TreeNodeParent =>
    'children' in node;
