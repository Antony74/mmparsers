export type TreeNodeLeaf = { type: string; text: string };
export type TreeNodeParent = { type: string; children: (TreeNodeLeaf | TreeNodeParent)[] };
export type TreeNode = TreeNodeLeaf | TreeNodeParent;

export type WhitespaceNode = { type: 'WHITESPACE'; text: string };
export type CommentNode = { type: '_COMMENT'; text: string };
export type MathSymbolNode = { type: 'MATH_SYMBOL'; text: string };
export type LabelNode = { type: 'LABEL'; text: string };
export type AssertionNode = { type: 'assertion'; children: (MathSymbolNode | WhitespaceNode)[] };
export type ProvableStmtNode = { type: 'provable_stmt'; children: any[] }; // no

export const isParentNode = (node: TreeNode): node is TreeNodeParent =>
    'children' in node;
