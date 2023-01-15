export type TreeNodeLeaf = { type: string; text: string };

export type TreeNodeParent = {
    type: string;
    children: (TreeNodeLeaf | TreeNodeParent)[];
};

export type TreeNode = TreeNodeLeaf | TreeNodeParent;

export type WhitespaceNode = { type: 'WHITESPACE'; text: string };
export type CommentNode = { type: '_COMMENT'; text: string };
export type MathSymbolNode = { type: 'MATH_SYMBOL'; text: string };
export type LabelNode = { type: 'LABEL'; text: string };
export type $cNode = { type: '$c'; text: '$c' };
export type $vNode = { type: '$v'; text: '$v' };
export type $eNode = { type: '$e'; text: '$e' };
export type $aNode = { type: '$a'; text: '$a' };
export type $pNode = { type: '$p'; text: '$p' };
export type $eqNode = { type: '$='; text: '$=' };
export type $dotNode = { type: '$.'; text: '$.' };
export type $BlockStartNode = { type: '${'; text: '${' };
export type $BlockEndNode = { type: '$}'; text: '$}' };

export type UnderscoreNode = {
    type: '_';
    children: (WhitespaceNode | CommentNode)[];
};

export type ConstantsNode = {
    type: 'constants';
    children: (MathSymbolNode | UnderscoreNode)[];
};

export type VariablesNode = {
    type: 'variables';
    children: (MathSymbolNode | UnderscoreNode)[];
};

export type StatementNode = {
    type: 'statement';
    children: (MathSymbolNode | UnderscoreNode)[];
};

export type AssertionNode = {
    type: 'assertion';
    children: (MathSymbolNode | UnderscoreNode)[];
};

export type ProofNode = {
    type: 'proof';
    children: (LabelNode | UnderscoreNode)[];
};

export type ChildStatement =
    | BlockNode
    | VariableStmtNode
    // | DisjointStmtNode
    | FloatingStmtNode
    | EssentialStmtNode
    | AxiomStmtNode
    | ProvableStmtNode;

export type StatementsNode = {
    type: 'statements';
    children: ChildStatement[];
};

export type ConstantStmtNode = {
    type: 'constant_stmt';
    children: [$cNode, UnderscoreNode, ConstantsNode, $dotNode];
};

export type VariableStmtNode = {
    type: 'variable_stmt';
    children: [$vNode, UnderscoreNode, VariablesNode, $dotNode];
};

export type EssentialStmtNode = {
    type: 'essential_stmt';
    children: [
        LabelNode,
        UnderscoreNode,
        $eNode,
        UnderscoreNode,
        StatementNode,
        $dotNode
    ];
};

export type FloatingStmtNode = {
    type: 'floating_stmt';
    children: [
        LabelNode,
        UnderscoreNode,
        MathSymbolNode,
        UnderscoreNode,
        StatementNode,
        $dotNode
    ];
};

export type AxiomStmtNode = {
    type: 'axiom_stmt';
    children: [
        LabelNode,
        UnderscoreNode,
        $aNode,
        UnderscoreNode,
        MathSymbolNode,
        UnderscoreNode,
        AssertionNode,
        $dotNode
    ];
};

export type ProvableStmtNode = {
    type: 'provable_stmt';
    children: [
        LabelNode,
        UnderscoreNode,
        $pNode,
        UnderscoreNode,
        MathSymbolNode,
        UnderscoreNode,
        AssertionNode,
        $eqNode,
        UnderscoreNode,
        ProofNode,
        $dotNode
    ];
};

export type BlockNode = {
    type: 'block';
    children: [$BlockStartNode, UnderscoreNode, StatementsNode, $BlockEndNode];
};

export type Database = {
    type: 'database';
    children: // IncludeStmtNode |
    (ConstantStmtNode | ChildStatement | WhitespaceNode | CommentNode)[];
};

export const isParentNode = (node: TreeNode): node is TreeNodeParent =>
    'children' in node;
