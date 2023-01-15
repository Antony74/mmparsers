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
export type $eNode = { type: '$e'; text: '$e' };
export type $aNode = { type: '$a'; text: '$a' };
export type $pNode = { type: '$p'; text: '$p' };
export type $eqNode = { type: '$='; text: '$=' };
export type $dotNode = { type: '$.'; text: '$.' };

export type Underscore = {
    type: '_';
    children: (WhitespaceNode | CommentNode)[];
};

export type StatementNode = {
    type: 'statement';
    children: (MathSymbolNode | WhitespaceNode)[];
};

export type AssertionNode = {
    type: 'assertion';
    children: (MathSymbolNode | WhitespaceNode)[];
};

export type ProofNode = {
    type: 'proof';
    children: (LabelNode | WhitespaceNode)[];
};

export type EssentialStmtNode = {
    type: 'essential_stmt';
    children: [
        LabelNode,
        Underscore,
        $eNode,
        Underscore,
        StatementNode,
        $dotNode
    ];
};

export type FloatingStmtNode = {
    type: 'floating_stmt';
    children: [
        LabelNode,
        Underscore,
        MathSymbolNode,
        Underscore,
        StatementNode,
        $dotNode
    ];
};

export type AxiomStmtNode = {
    type: 'axiom_stmt';
    children: [
        LabelNode,
        Underscore,
        $aNode,
        Underscore,
        MathSymbolNode,
        Underscore,
        AssertionNode,
        $dotNode
    ];
};

export type ProvableStmtNode = {
    type: 'provable_stmt';
    children: [
        LabelNode,
        Underscore,
        $pNode,
        Underscore,
        MathSymbolNode,
        Underscore,
        AssertionNode,
        $eqNode,
        Underscore,
        ProofNode,
        $dotNode
    ];
};

export const isParentNode = (node: TreeNode): node is TreeNodeParent =>
    'children' in node;
